import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamObject,
  streamText,
} from "ai";
import { z } from "zod";
import { systemPrompt } from "@/lib/ai/promts";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";

import { generateTitleFromUserMessage } from "@/app/(auth)/(platform)/(ai-chat)/chat/actions";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prismadb";
import { customModel } from "@/lib/ai";
import { models } from "@/lib/ai/models";
import { Suggestion } from "@/app/(auth)/(platform)/(calendar)/earnings/types";

export const maxDuration = 60;

type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "queryEarnings";
// | "getWeather"

const blocksTools: AllowedTools[] = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];

// const weatherTools: AllowedTools[] = ["getWeather"];

const earningsTools: AllowedTools[] = ["queryEarnings"];

const allTools: AllowedTools[] = [...blocksTools, ...earningsTools];

export async function POST(request: Request) {
  // Log incoming request
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  console.log("=== INCOMING REQUEST ===");
  console.log("Chat ID:", id);
  console.log("Model ID:", modelId);
  console.log("Messages:", JSON.stringify(messages, null, 2));

  const { userId } = await auth();
  console.log(userId);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  console.log(model);

  if (!model) {
    return new Response("Model not found", { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  console.log(coreMessages);
  const userMessage = getMostRecentUserMessage(coreMessages);
  console.log(userMessage);

  if (!userMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const chat = await prisma.chat.findUnique({
    where: { id },
  });

  console.log(chat);

  if (chat === null) {
    // const title = await generateTitleFromUserMessage({ message: userMessage });
    await prisma.chat.create({
      data: {
        id,
        userId,
        title: messages[0].content,
        visibility: "private",
      },
    });
  }

  console.log(messages);

  const userMessageId = generateUUID();
  // Save the user's message
  const newMessage = await prisma.message.create({
    data: {
      id: userMessageId,
      chatId: id,
      role: "user",
      content: messages[messages.length - 1].content,
    },
  });

  console.log(newMessage);

  const streamingData = new StreamData();

  console.log("=== STREAMING DATA ===");
  console.log(streamingData);

  streamingData.append({
    type: "user-message-id",
    content: userMessageId,
  });

  console.log(customModel(model.apiIdentifier));

  const result = streamText({
    model: customModel(model.apiIdentifier),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: allTools,
    tools: {
      createDocument: {
        description: "Create a document for a writing activity",
        parameters: z.object({
          title: z.string(),
        }),
        execute: async ({ title }) => {
          const id = generateUUID();
          let draftText = "";

          streamingData.append({
            type: "id",
            content: id,
          });

          streamingData.append({
            type: "title",
            content: title,
          });

          streamingData.append({
            type: "clear",
            content: "",
          });

          const { fullStream } = streamText({
            model: customModel(model.apiIdentifier),
            system:
              "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
            prompt: title,
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === "text-delta") {
              const { textDelta } = delta;

              draftText += textDelta;
              streamingData.append({
                type: "text-delta",
                content: textDelta,
              });
            }
          }

          streamingData.append({ type: "finish", content: "" });

          await prisma.document.create({
            data: {
              id,
              title,
              content: draftText,
              userId: userId,
            },
          });

          return {
            id,
            title,
            content: "A document was created and is now visible to the user.",
          };
        },
      },
      updateDocument: {
        description: "Update a document with the given description",
        parameters: z.object({
          id: z.string().describe("The ID of the document to update"),
          description: z
            .string()
            .describe("The description of changes that need to be made"),
        }),
        execute: async ({ id, description }) => {
          const document = await prisma.document.findUnique({
            where: { id },
          });

          if (!document) {
            return {
              error: "Document not found",
            };
          }

          const { content: currentContent } = document;
          let draftText = "";

          streamingData.append({
            type: "clear",
            content: document.title,
          });

          const { fullStream } = streamText({
            model: customModel(model.apiIdentifier),
            system:
              "You are a helpful writing assistant. Based on the description, please update the piece of writing.",
            experimental_providerMetadata: {
              openai: {
                prediction: {
                  type: "content",
                  content: currentContent,
                },
              },
            },
            messages: [
              {
                role: "user",
                content: description,
              },
              { role: "user", content: currentContent },
            ],
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === "text-delta") {
              const { textDelta } = delta;

              draftText += textDelta;
              streamingData.append({
                type: "text-delta",
                content: textDelta,
              });
            }
          }

          streamingData.append({ type: "finish", content: "" });

          await prisma.document.update({
            where: { id },
            data: {
              title: document.title,
              content: draftText,
            },
          });

          return {
            id,
            title: document.title,
            content: "The document has been updated successfully.",
          };
        },
      },
      // getWeather: {
      //   description: "Get the current weather at a location",
      //   parameters: z.object({
      //     latitude: z.number(),
      //     longitude: z.number(),
      //   }),
      //   execute: async ({ latitude, longitude }) => {
      //     const response = await fetch(
      //       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
      //     );

      //     const weatherData = await response.json();
      //     return weatherData;
      //   },
      // },
      requestSuggestions: {
        description: "Request suggestions for a document",
        parameters: z.object({
          documentId: z
            .string()
            .describe("The ID of the document to request edits"),
        }),
        execute: async ({ documentId }) => {
          const document = await prisma.document.findUnique({
            where: { id: documentId },
          });

          if (!document || !document.content) {
            return {
              error: "Document not found",
            };
          }

          const suggestions: Array<
            Omit<Suggestion, "userId" | "createdAt" | "documentCreatedAt">
          > = [];

          const { elementStream } = streamObject({
            model: customModel(model.apiIdentifier),
            system:
              "You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.",
            prompt: document.content,
            output: "array",
            schema: z.object({
              originalSentence: z.string().describe("The original sentence"),
              suggestedSentence: z.string().describe("The suggested sentence"),
              description: z
                .string()
                .describe("The description of the suggestion"),
            }),
          });

          for await (const element of elementStream) {
            const suggestion = {
              originalText: element.originalSentence,
              suggestedText: element.suggestedSentence,
              description: element.description,
              id: generateUUID(),
              documentId: documentId,
              isResolved: false,
            };

            streamingData.append({
              type: "suggestion",
              content: suggestion,
            });

            suggestions.push(suggestion as any);
          }

          // if (session.user?.id) {
          //   const userId = session.user.id;

          //   await saveSuggestions({
          //     suggestions: suggestions.map((suggestion) => ({
          //       ...suggestion,
          //       userId,
          //       createdAt: new Date(),
          //       documentCreatedAt: document.createdAt,
          //     })),
          //   });
          // }

          return {
            id: documentId,
            title: document.title,
            message: "Suggestions have been added to the document",
          };
        },
      },
      queryEarnings: {
        description: "Query earnings information and transcripts for companies",
        parameters: z.object({
          symbol: z.string().describe("The company stock symbol"),
          quarter: z.number().optional().describe("The quarter number (1-4)"),
          year: z.number().optional().describe("The year"),
        }),
        execute: async ({ symbol, quarter, year }) => {
          // Find company first to get the ID
          const company = await prisma.company.findFirst({
            where: {
              symbol: symbol.toUpperCase(),
              mic: { in: ["XNAS", "XNYS"] }, // Optimize by limiting to main exchanges
            },
            select: {
              // Only select needed fields
              id: true,
              marketCapitalization: true,
              symbol: true,
            },
          });

          if (!company) {
            return { message: `Company not found: ${symbol}` };
          }

          // Get most recent earnings if quarter/year not specified
          const earnings = await prisma.earnings.findFirst({
            where: {
              symbol: symbol.toUpperCase(),
              ...(quarter && { quarter }),
              ...(year && { year }),
            },
            orderBy: { earningsDate: "desc" },
            select: {
              // Only select needed fields
              symbol: true,
              earningsDate: true,
              earningsTime: true,
              quarter: true,
              year: true,
              isDateConfirmed: true,
            },
          });

          if (!earnings) {
            return { message: `No earnings data found for ${symbol}` };
          }

          // Get most recent transcript
          const transcript = await prisma.transcript.findFirst({
            where: {
              companyId: company.id,
              quarter: earnings.quarter,
              year: earnings.year,
              status: "COMPLETED", // Only get completed transcripts
            },
            select: {
              aiSummary: true,
              fullText: true,
              status: true,
              epsActual: true,
              epsEstimate: true,
              revenueActual: true,
              revenueEstimate: true,
            },
          });

          // If we have earnings and company, check for transcript
          let transcriptData = null;
          if (earnings && company && transcript) {
            // Generate summary if fullText exists but no aiSummary
            let summary = transcript.aiSummary;
            if (transcript.fullText && !transcript.aiSummary) {
              const { fullStream } = streamText({
                model: customModel(model.apiIdentifier),
                system:
                  "You are a financial analyst. Provide a concise, professional summary of this earnings call transcript. Focus on key financial metrics, strategic initiatives, and important announcements.",
                prompt: transcript.fullText,
              });

              let generatedSummary = "";
              for await (const delta of fullStream) {
                if (delta.type === "text-delta") {
                  generatedSummary += delta.textDelta;
                }
              }
              summary = generatedSummary;
            }

            transcriptData = {
              summary,
              status: transcript.status,
              financials: {
                eps: {
                  actual: transcript.epsActual,
                  estimate: transcript.epsEstimate,
                },
                revenue: {
                  actual: transcript.revenueActual,
                  estimate: transcript.revenueEstimate,
                },
              },
            };
          }

          return {
            symbol: earnings.symbol,
            date: earnings.earningsDate,
            time: earnings.earningsTime,
            quarter: earnings.quarter,
            year: earnings.year,
            isConfirmed: earnings.isDateConfirmed,
            transcript: transcriptData,
          };
        },
      },
    },
    onFinish: async ({ response }) => {
      console.log("=== AI RESPONSE ===");
      console.log(
        "Response Messages:",
        JSON.stringify(response.messages, null, 2)
      );

      if (userId) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(response.messages);

          await prisma.message.createMany({
            data: responseMessagesWithoutIncompleteToolCalls.map((message) => {
              const messageId = generateUUID();

              if (message.role === "assistant") {
                streamingData.appendMessageAnnotation({
                  messageIdFromServer: messageId,
                });
              }

              return {
                id: messageId,
                chatId: id,
                role: message.role,
                content: JSON.stringify(message.content),
                createdAt: new Date(),
              };
            }),
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    if (chat?.userId !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await prisma.chat.delete({
      where: { id },
    });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
