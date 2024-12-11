import { memo, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { UIBlock } from "./block";
import equal from "fast-deep-equal";
import { CrossIcon } from "lucide-react";

interface BlockCloseButtonProps {
  setBlock: (value: SetStateAction<UIBlock>) => void;
}

function PureBlockCloseButton({ setBlock }: BlockCloseButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-fit p-2 dark:hover:bg-zinc-700"
      onClick={() => {
        setBlock((currentBlock) => ({
          ...currentBlock,
          isVisible: false,
        }));
      }}
    >
      <CrossIcon size={18} />
    </Button>
  );
}

export const BlockCloseButton = memo(PureBlockCloseButton, () => true);
