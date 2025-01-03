import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import puppeteer from "puppeteer";
import type {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  Message,
  ToolInvocation,
} from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatCurrency = (amount: number, isRevenue = false) => {
  if (isRevenue) {
    // Format revenue in millions/billions
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  // Format EPS
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<CoreMessage>
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: generateUUID(),
      role: message.role as Message["role"],
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
        ? content.text.length > 0
        : true
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0
  );
}

export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<{ createdAt: Date }>,
  index: number
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getMessageIdFromAnnotations(message: Message) {
  if (!message.annotations) return message.id;

  const [annotation] = message.annotations;
  if (!annotation) return message.id;

  // @ts-expect-error messageIdFromServer is not defined in MessageAnnotation
  return annotation.messageIdFromServer;
}

// export const edgeMediaServerFormFill = async (link: string) => {
//   let browser;
//   try {
//     browser = await puppeteer.launch({
//       channel: "chrome",
//       headless: true,
//     });

//     const page = await browser.newPage();

//     // Set up the promise before any navigation
//     const m3u8Promise = new Promise((resolve) => {
//       page.on("request", (request) => {
//         const url = request.url();
//         if (
//           request.method() === "GET" &&
//           url.includes("media-server.com") &&
//           url.includes(".m3u8")
//         ) {
//           console.log("\n=== HLS Stream URL Found ===");
//           console.log("URL:", url);
//           resolve(url);
//         }
//       });
//     });

//     await page.goto(link);

//     // Wait for form elements to load
//     await page.waitForSelector('input[type="text"]');

//     // Form data
//     const formData = {
//       firstName: "Andy",
//       lastName: "Lanchipa",
//       email: "andy@nudgem.com",
//       institution: "Nudgem",
//       country: "United States",
//     };

//     // Fill in form fields if they exist
//     const fillIfExists = async (selector: string, value: string) => {
//       const element = await page.$(selector);
//       if (element) {
//         await page.type(selector, value);
//       }
//     };

//     await fillIfExists('input[name*="first"]', formData.firstName);
//     await fillIfExists('input[name*="last"]', formData.lastName);
//     await fillIfExists('input[name*="email"]', formData.email);
//     await fillIfExists(
//       'input[name*="institution"], input[name*="company"]',
//       formData.institution
//     );
//     await fillIfExists('input[name="custom_2"]', formData.country);

//     // Wait for any submit button to be available
//     await page.waitForSelector('button[type="submit"]');

//     // Find and click the first submit button
//     const submitButton = await page.$('button[type="submit"]');

//     if (submitButton) {
//       // Remove any disabled attributes that might prevent clicking
//       await page.evaluate(() => {
//         const button = document.querySelector('button[type="submit"]');
//         if (button) {
//           button.removeAttribute("aria-disabled");
//           button.removeAttribute("disabled");
//         }
//       });

//       await submitButton.click();
//     } else {
//       throw new Error("Submit button not found");
//     }

//     // Wait for the m3u8 URL with timeout
//     const mediaUrl = await m3u8Promise;

//     return mediaUrl;
//   } catch (error) {
//     console.error("Error in form fill:", error);
//     throw error;
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };
