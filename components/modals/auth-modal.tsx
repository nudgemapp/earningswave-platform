"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { TriangleAlert } from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { OTPInput } from "input-otp";
import { useAuthModal } from "@/store/AuthModalStore";
// import { showSuccessToast } from "@/components/toast/success-tost";
import { Slot, FakeDash } from "@/components/OTPInput";

export const AuthModal = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"initial" | "email" | "password" | "otp">(
    "initial"
  );
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const {
    isLoaded: isSignInLoaded,
    signIn,
    setActive: setActiveSignIn,
  } = useSignIn();
  const { isOpen, onClose } = useAuthModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!isSignUpLoaded && isSignUp) || (!isSignInLoaded && !isSignUp)) return;

    if (!showPassword) {
      if (isValidEmail(email)) {
        setShowPassword(true);
      } else {
        setError("Please enter a valid email");
      }
      return;
    }

    try {
      if (isSignUp && signUp) {
        await signUp.create({
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setStep("otp");
      } else if (signIn) {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete") {
          await setActiveSignIn({ session: result.createdSessionId });
          onClose();
        }
      }
    } catch (err: unknown) {
      console.error("Error:", JSON.stringify(err, null, 2));
      if (err && typeof err === "object" && "errors" in err) {
        const clerkError = err as { errors?: Array<{ message: string }> };
        setError(
          clerkError.errors?.[0]?.message || "An unexpected error occurred"
        );
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const onEmailVerify = async (code: string) => {
    if (!isSignUpLoaded || !signUp) return;

    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignup.status === "complete") {
        await setActive({ session: completeSignup.createdSessionId });
        onClose();
      } else {
        setError("Verification failed");
        setCode("");
        setShake(true);
      }
    } catch {
      setError("Invalid verification code");
      setCode("");
      setShake(true);
    }
  };

  const handleOAuthSignIn = async (strategy: "oauth_google") => {
    const auth = isSignUp ? signUp : signIn;
    if (!auth) return;

    try {
      await auth.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/oportunidades",
      });
    } catch (err: unknown) {
      console.error("OAuth Error:", JSON.stringify(err, null, 2));
    }
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    setEmail("");
    setPassword("");
    setError(null);
  };

  const getButtonText = () => {
    if (step === "otp") return "Verify";
    if (!showPassword) return "Continue";
    return isSignUp ? "Sign up" : "Sign in";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-black p-6 text-black dark:text-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-center w-full -mb-4">
            <Logo width={200} height={200} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 text-center">
              {isSignUp ? "Create a free account" : "Sign in"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              {isSignUp
                ? "Free access to 1 transcript per month"
                : "Access your account to get started"}
            </p>
          </div>

          <button
            onClick={() => handleOAuthSignIn("oauth_google")}
            className="w-full flex items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-gray-100 px-4 py-3 text-neutral-700 shadow-[0px_1.5px_0px_0px_rgba(0,0,0,0.05)_inset] transition duration-200 hover:bg-gray-100/80 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
          >
            <IconBrandGoogleFilled className="h-4 w-4" />
            <span className="text-sm">Continue with Google</span>
          </button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500 dark:bg-black dark:text-neutral-400">
                Or continue with email
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive w-full">
              <TriangleAlert className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          {step === "otp" ? (
            <div className="w-full flex-1 flex flex-col justify-center space-y-4">
              <h3 className="text-center text-lg font-medium">
                Verify your email
              </h3>
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                Enter the code we sent to {email}
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex items-center"
              >
                <motion.div
                  animate={
                    shake
                      ? {
                          x: [-2, 2, -2, 2, 0],
                          transition: { duration: 0.4 },
                        }
                      : {}
                  }
                  className="w-full"
                >
                  <OTPInput
                    onComplete={onEmailVerify}
                    onChange={(code) => {
                      setCode(code);
                      setError(null);
                    }}
                    value={code}
                    maxLength={6}
                    required
                    className="flex justify-center"
                    containerClassName="group flex items-center has-[:disabled]:opacity-30"
                    render={({ slots }) => (
                      <>
                        <div className="flex">
                          {slots.slice(0, 3).map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                        <FakeDash />
                        <div className="flex">
                          {slots.slice(3).map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                      </>
                    )}
                  />
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
              />

              <motion.input
                initial={false}
                animate={{
                  height: showPassword ? "40px" : "0px",
                  opacity: showPassword ? 1 : 0,
                  marginTop: showPassword ? "16px" : "0px",
                }}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block h-10 w-full rounded-md border-0 bg-white px-4 py-1.5 text-black shadow-input placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white sm:text-sm sm:leading-6"
              />

              <button
                type="submit"
                className="group/btn relative w-full rounded-lg bg-black px-4 py-3 text-white dark:bg-white dark:text-black"
              >
                <span className="text-sm">{getButtonText()}</span>
              </button>
            </form>
          )}

          <div className="text-center text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </span>
            <button
              onClick={toggleMode}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
