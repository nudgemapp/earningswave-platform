import { generateUUID } from "@/lib/utils";
import { Chat } from "@/components/chat/chat";
import { cookies } from "next/headers";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
      />
    </div>
  );
}
