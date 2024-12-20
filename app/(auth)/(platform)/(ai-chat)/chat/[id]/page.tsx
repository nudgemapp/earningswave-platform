import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { convertToUIMessages } from "@/lib/utils";
import { Chat } from "@/components/chat/chat";
import { DEFAULT_MODEL_NAME } from "@/lib/ai/models";
import { models } from "@/lib/ai/models";
import { auth } from "@clerk/nextjs/server";
import { VisibilityType } from "@/components/chat/visibility-selector";
import prisma from "@/lib/prismadb";
import { CoreMessage } from "ai";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const { id } = params;
  const chat = await prisma.chat.findUnique({ where: { id } });

  if (!chat) {
    notFound();
  }

  if (chat.visibility === "private") {
    if (!session?.userId) {
      return notFound();
    }

    if (session.userId !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = (await prisma.message.findMany({
    where: { chatId: id },
    select: {
      id: true,
      role: true,
      content: true,
      chatId: true,
      createdAt: true,
      updatedAt: true,
    },
  })) as unknown as CoreMessage[];

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={selectedModelId}
      selectedVisibilityType={chat.visibility as VisibilityType}
      isReadonly={session?.userId !== chat.userId}
    />
  );
}
