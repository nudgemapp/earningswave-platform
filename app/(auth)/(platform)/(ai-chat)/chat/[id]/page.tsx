import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
// import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";
import { Chat } from "@/components/chat/chat";
import { auth } from "@clerk/nextjs/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  //   const chat = await getChatById({ id });

  //   if (!chat) {
  //     notFound();
  //   }

  const session = await auth();

  console.log(session);

  //   if (chat.visibility === "private") {
  //     if (!session || !session.user) {
  //       return notFound();
  //     }

  //     if (session.user.id !== chat.userId) {
  //       return notFound();
  //     }
  //   }

  //   const messagesFromDb = await getMessagesByChatId({
  //     id,
  //   });

  //   const cookieStore = await cookies();
  //   const modelIdFromCookie = cookieStore.get("model-id")?.value;
  //   const selectedModelId =
  //     models.find((model) => model.id === modelIdFromCookie)?.id ||
  //     DEFAULT_MODEL_NAME;

  return (
    <div>hello</div>
    // <Chat
    //   id={chat.id}
    //   initialMessages={convertToUIMessages(messagesFromDb)}
    //   selectedModelId={selectedModelId}
    //   selectedVisibilityType={chat.visibility}
    //   isReadonly={session?.user?.id !== chat.userId}
    // />
  );
}
