"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { memo } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const { isSignedIn } = useUser();
  const authModal = useAuthModal();

  const handleSuggestedAction = async (
    event: React.MouseEvent,
    action: string
  ) => {
    event.preventDefault();

    if (!isSignedIn) {
      authModal.onOpen();
      return;
    }

    window.history.replaceState({}, "", `/chat/${chatId}`);
    await append({
      role: "user",
      content: action,
    });
  };

  const suggestedActions = [
    {
      title: "When does Netflix report earnings?",
      label: "for Q4 2024",
      action: "When does Netflix report earnings for Q4 2024?",
    },
    {
      title: "Did NVIDIA surpass market expectations?",
      label: "for Q3 2024",
      action: "Did NVIDIA surpass market expectations for Q3 2024?",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={(e) => handleSuggestedAction(e, suggestedAction.action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
