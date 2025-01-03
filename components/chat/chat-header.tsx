"use client";

import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { useUser } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { useUserSubscription } from "@/app/hooks/use-user-subscription";
import { ModelSelector } from "./model-selector";
import { SidebarToggle } from "./sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { VisibilitySelector, VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  console.log(chatId);
  const router = useRouter();
  const { open } = useSidebar();
  const { user } = useUser();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
  const { data: subscription } = useUserSubscription(user?.id);
  const hasActiveSubscription =
    subscription &&
    subscription.status === "active" &&
    subscription.start_date &&
    subscription.end_date &&
    new Date() >= new Date(subscription.start_date) &&
    new Date() <= new Date(subscription.end_date);

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <div className="flex items-center gap-2">
        <SidebarToggle />

        {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="md:px-2 px-2 md:h-fit"
                onClick={() => {
                  router.push("/chat");
                  router.refresh();
                }}
              >
                <PlusIcon size={16} />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}

        {!isReadonly && <ModelSelector selectedModelId={selectedModelId} />}

        {!isReadonly && chatId && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
      </div>

      <Button
        className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 hidden md:flex py-1.5 px-2 h-fit md:h-[34px] ml-auto"
        onClick={() => {
          if (!user) {
            authModal.onOpen();
            return;
          }

          if (!hasActiveSubscription) {
            subscriptionModal.onOpen();
            return;
          }
        }}
      >
        Get Trader 🚀
      </Button>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
