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
import { VisibilitySelector } from "./visibility-selector";
// import { VisibilityType, VisibilitySelector } from './visibility-selector';

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: any;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { user } = useUser();
  const authModal = useAuthModal();
  const subscriptionModal = useSubscriptionModal();
  const { data: subscription } = useUserSubscription(user?.id);
  const hasActiveSubscription = subscription?.isActive;

  const { width: windowWidth } = useWindowSize();

  const navigationLinks = [
    { route: "/", name: "Calendar" },
    { route: "/api", name: "API" },
    { route: "/pricing", name: "Pricing" },
    { route: "/chat", name: "Chat" },
  ];

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

        {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
          />
        )}
      </div>

      <div className="hidden md:flex gap-2 absolute left-1/2 transform -translate-x-1/2">
        {navigationLinks.map((link) => (
          <Button
            key={link.route}
            variant="ghost"
            className="px-2 h-[34px]"
            onClick={() => {
              router.push(link.route);
              router.refresh();
            }}
          >
            {link.name}
          </Button>
        ))}
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
