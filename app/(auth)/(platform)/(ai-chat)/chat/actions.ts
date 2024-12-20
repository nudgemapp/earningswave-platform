"use server";

import { type CoreUserMessage, generateText } from "ai";
import { cookies } from "next/headers";

import { customModel } from "@/lib/ai";
import { VisibilityType } from "@/components/chat/visibility-selector";
import prisma from "@/lib/prismadb";

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("model-id", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {
  console.log(message);
  const { text: title } = await generateText({
    model: customModel("gpt-4o-mini"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  console.log(title);

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await prisma.message.findMany({ where: { id } });

  await prisma.message.deleteMany({
    where: {
      chatId: message.chatId,
      createdAt: {
        lt: message.createdAt,
      },
    },
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  try {
    // First check if the chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return;
    }

    console.log(chat);

    // If chat exists, proceed with update
    await prisma.chat.update({
      where: { id: chatId },
      data: { visibility },
    });
  } catch (error) {
    console.error("Error updating chat visibility:", error);
    throw error; // Re-throw the error to handle it in the UI layer
  }
}
