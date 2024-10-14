"use client";

import { AuthModal } from "@/components/modals/auth-modal";
import { EmailModal } from "@/components/modals/email-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AuthModal />
      <EmailModal />
    </>
  );
};
