"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/authDialog";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/store/AuthModalStore";
import { useRouter } from "next/navigation";

export const AuthModal = () => {
  const router = useRouter();
  const authModal = useAuthModal();

  const handleSignUp = () => {
    authModal.onClose();
    router.push("/api/auth/login");
  };

  const handleCancel = () => {
    authModal.onClose();
  };

  return (
    <Dialog open={authModal.isOpen} onOpenChange={authModal.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Account Required</h2>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            An account is needed to view the whole calendar and access all
            features of the earnings calendar.
          </p>
        </div>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSignUp}>Sign Up / Sign In</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
