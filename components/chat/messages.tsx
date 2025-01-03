import { ChatRequestOptions, Message } from "ai";
import { useScrollToBottom } from "../use-scroll-to-bottom";
import { Overview } from "./overview";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { PreviewMessage, ThinkingMessage } from "./message";
import { UIBlock } from "./block";
import { useUserSubscription } from "@/app/hooks/use-user-subscription";
import { useUser } from "@clerk/nextjs";
import useGetMessageCount from "@/features/user/api/use-get-message-count";

interface MessagesProps {
  chatId: string;
  block: UIBlock;
  setBlock: Dispatch<SetStateAction<UIBlock>>;
  isLoading: boolean;
  // votes: Array<any> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
}

function PureMessages({
  chatId,
  block,
  setBlock,
  isLoading,
  // votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const { user } = useUser();
  const { data: subscription } = useUserSubscription(user?.id);

  const { data: messageCount } = useGetMessageCount();

  const hasActiveSubscription =
    subscription &&
    subscription.status === "active" &&
    subscription.start_date &&
    subscription.end_date &&
    new Date() >= new Date(subscription.start_date) &&
    new Date() <= new Date(subscription.end_date);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-8 flex-1 overflow-y-scroll py-6 px-2"
    >
      {!hasActiveSubscription && (
        <div className="text-sm text-muted-foreground text-center">
          {`${5 - messageCount} messages remaining in free trial`}
        </div>
      )}

      {messages.length === 0 && <Overview />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          block={block}
          setBlock={setBlock}
          isLoading={isLoading && messages.length - 1 === index}
          // vote={
          //   votes
          //     ? votes.find((vote) => vote.messageId === message.id)
          //     : undefined
          // }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

function areEqual(prevProps: MessagesProps, nextProps: MessagesProps) {
  if (
    prevProps.block.status === "streaming" &&
    nextProps.block.status === "streaming"
  ) {
    return true;
  }

  return false;
}

export const Messages = memo(PureMessages, areEqual);
