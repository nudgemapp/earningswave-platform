"use client";

import type { ChatRequestOptions, Message } from "ai";
import { motion } from "framer-motion";
import { memo, useState, type Dispatch, type SetStateAction } from "react";
import type { UIBlock } from "./block";
import { DocumentToolCall, DocumentToolResult } from "./document";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import equal from "fast-deep-equal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilLine, Sparkles, SparklesIcon } from "lucide-react";
import { cx } from "class-variance-authority";
import { EarningsResult } from "./earnings-result";
// import { MessageEditor } from "./message-editor";
// import { MessageActions } from "./message-actions";

const PurePreviewMessage = ({
  // chatId,
  message,
  block,
  setBlock,
  //   vote,
  // isLoading,
  // setMessages,
  // reload,
  isReadonly,
}: {
  chatId: string;
  message: Message;
  block: UIBlock;
  setBlock: Dispatch<SetStateAction<UIBlock>>;
  //   vote: Vote | undefined;
  isLoading: boolean;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  console.log(message);

  // Safely parse the message content if it's a JSON string
  const parsedContent =
    typeof message.content === "string"
      ? (() => {
          try {
            return JSON.parse(message.content);
          } catch (e) {
            console.log(e);
            return message.content;
          }
        })()
      : message.content;

  // Parse tool invocations if they exist
  const parsedToolInvocations = message.toolInvocations?.map((invocation) => {
    if (typeof invocation === "string") {
      try {
        return JSON.parse(invocation);
      } catch (e) {
        console.log(e);
        return invocation;
      }
    }
    return invocation;
  });

  // Update the message with parsed content and tool invocations
  const processedMessage = {
    ...message,
    content: parsedContent,
    toolInvocations: parsedToolInvocations,
  };

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cn(
          "flex gap-4 w-full",
          "group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
          {
            "w-full": mode === "edit",
            "group-data-[role=user]/message:w-fit": mode !== "edit",
          }
        )}
      >
        {message.role === "assistant" && (
          <div className="size-8 flex items-center rounded-full justify-center shrink-0 bg-purple-50 border border-purple-100">
            <Sparkles size={14} className="text-purple-600" />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          {message.experimental_attachments && (
            <div className="flex flex-row justify-end gap-2">
              {message.experimental_attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}

          {processedMessage.content && mode === "view" && (
            <div className="flex flex-row gap-2 items-start">
              {message.role === "user" && !isReadonly && (
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100 hover:bg-transparent"
                      onClick={() => {
                        setMode("edit");
                      }}
                    >
                      <PencilLine size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={5}>
                    Edit message
                  </TooltipContent>
                </Tooltip>
              )}

              <div
                className={cn("flex flex-col gap-4 py-2 px-3 rounded-2xl", {
                  "bg-primary text-primary-foreground": message.role === "user",
                  "bg-purple-50/50 text-purple-900":
                    message.role === "assistant",
                })}
              >
                {Array.isArray(processedMessage.content) ? (
                  processedMessage.content.map((content, index) => {
                    if (content.type === "text") {
                      return <Markdown key={index}>{content.text}</Markdown>;
                    }
                    // Handle other content types as needed
                    return null;
                  })
                ) : (
                  <Markdown>{processedMessage.content as string}</Markdown>
                )}
              </div>
            </div>
          )}

          {message.content && mode === "edit" && (
            <div className="flex flex-row gap-2 items-start">
              <div className="size-8" />

              {/* <MessageEditor
                key={message.id}
                message={message}
                setMode={setMode}
                setMessages={setMessages}
                reload={reload}
              /> */}
            </div>
          )}

          {processedMessage.toolInvocations &&
            processedMessage.toolInvocations.length > 0 && (
              <div className="flex flex-col gap-4">
                {processedMessage.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state, args } = toolInvocation;

                  if (state === "result") {
                    const { result } = toolInvocation;

                    return (
                      <div key={toolCallId}>
                        {toolName === "queryEarnings" ? (
                          <EarningsResult
                            result={result}
                            block={block}
                            setBlock={setBlock}
                            isReadonly={isReadonly}
                          />
                        ) : toolName === "createDocument" ? (
                          <DocumentToolResult
                            type="create"
                            result={result}
                            block={block}
                            setBlock={setBlock}
                            isReadonly={isReadonly}
                          />
                        ) : (
                          <pre>{JSON.stringify(result, null, 2)}</pre>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ["queryEarnings"].includes(toolName),
                      })}
                    >
                      {toolName === "queryEarnings" ? (
                        <div>...</div>
                      ) : toolName === "createDocument" ? (
                        <DocumentToolCall
                          type="create"
                          args={args}
                          setBlock={setBlock}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "updateDocument" ? (
                        <DocumentToolCall
                          type="update"
                          args={args}
                          setBlock={setBlock}
                          isReadonly={isReadonly}
                        />
                      ) : toolName === "requestSuggestions" ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                          setBlock={setBlock}
                          isReadonly={isReadonly}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

          {/* {!isReadonly && (
            <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              //   vote={vote}
              isLoading={isLoading}
            />
          )} */}
        </div>
      </div>
    </motion.div>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.content !== nextProps.message.content) return false;
    if (
      !equal(
        prevProps.message.toolInvocations,
        nextProps.message.toolInvocations
      )
    )
      return false;
    // if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  }
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div className="flex gap-4">
        <div className="size-8 flex items-center rounded-full justify-center shrink-0 bg-purple-50 border border-purple-100">
          <SparklesIcon size={14} className="text-purple-600 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-purple-600/75">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
