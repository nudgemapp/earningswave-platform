"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function EmailModal() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit email");
      }

      setMessage("Email collected successfully!");
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
      console.error("Error submitting email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white text-primary hover:bg-gray-100 transition-colors duration-200"
        >
          Talk to sales
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Interested in EarningsWave?
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Enter your email address to receive updates and promotions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </Button>
            </motion.div>
          </DialogFooter>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </DialogContent>
    </Dialog>
  );
}
