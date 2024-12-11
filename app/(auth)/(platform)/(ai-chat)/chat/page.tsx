import { generateUUID } from "@/lib/utils";
import { Chat } from "@/components/chat/chat";
// import { cookies } from "next/headers";

export default async function Page() {
  const id = generateUUID();

  // const cookieStore = await cookies();
  // const modelIdFromCookie = cookieStore.get("model-id")?.value;

  // const selectedModelId =
  //   models.find((model) => model.id === modelIdFromCookie)?.id ||
  //   DEFAULT_MODEL_NAME;

  const selectedModelId = "claude-3-5-sonnet-20240620";

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelId={selectedModelId}
      selectedVisibilityType="private"
      isReadonly={false}
    />
  );
}
