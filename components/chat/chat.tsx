"use client";

import type { Attachment, ChatRequestOptions, Message } from "ai";
import { useChat } from "ai/react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useWindowSize } from "usehooks-ts";
import { Block, type UIBlock } from "./block";
import { BlockStreamHandler } from "./block-stream-handler";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import { VisibilityType } from "./visibility-selector";
import { ChatHeader } from "./chat-header";
import { useUser } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { user } = useUser();
  const authModal = useAuthModal();
  const { mutate } = useSWRConfig();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
    data: streamingData,
  } = useChat({
    id,
    body: { id, modelId: selectedModelId },
    initialMessages,
    onFinish: () => {
      mutate("/api/chat/history");
    },
  });

  // console.log(messages);

  // console.log(initialMessages);

  // console.log(streamingData);
  // console.log(id);
  // console.log(messages);

  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  const [block, setBlock] = useState<UIBlock>({
    documentId: "init",
    content: "",
    title: "",
    status: "idle",
    isVisible: false,
    boundingBox: {
      top: windowHeight / 4,
      left: windowWidth / 4,
      width: 250,
      height: 50,
    },
  });

  // const { data: votes } = useSWR<Array<Vote>>(
  //   `/api/vote?chatId=${id}`,
  //   fetcher,
  // );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const [error, setError] = useState<string | null>(null);

  // Modified to match the expected type signature
  const handleAuthenticatedSubmit = async (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions
  ) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!user) {
      authModal.onOpen();
      return;
    }

    try {
      setError(null);
      await handleSubmit(event, chatRequestOptions);
    } catch (err: any) {
      if (err.response?.status === 403) {
        const data = await err.response.json();
        setError(data.message);
        // Don't redirect, just show the error message
      } else if (err.response?.status === 404) {
        // Handle 404 specifically
        setError("Chat not found or inaccessible");
      } else {
        // Handle other errors
        setError("An error occurred while sending your message");
      }
      console.error("Chat error:", err);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedModelId}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <div className="flex-1 overflow-y-auto">
          <Messages
            chatId={id}
            block={block}
            setBlock={setBlock}
            isLoading={isLoading}
            messages={messages}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
          />
        </div>

        {error && (
          <div className="mx-auto px-4 py-2 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <div className="flex-shrink-0 w-full bg-background pt-2">
          <form className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            {!isReadonly && (
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleAuthenticatedSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                setMessages={setMessages}
                append={append}
              />
            )}
          </form>
        </div>
      </div>

      <AnimatePresence>
        {block?.isVisible && (
          <Block
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append}
            block={block}
            setBlock={setBlock}
            messages={messages}
            setMessages={setMessages}
            reload={reload}
            // votes={votes}
            isReadonly={isReadonly}
          />
        )}
      </AnimatePresence>

      <BlockStreamHandler streamingData={streamingData} setBlock={setBlock} />
    </>
  );
}
