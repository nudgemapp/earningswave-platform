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
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit email");
      }

      // Handle successful submission (e.g., show a success message, close the modal)
      console.log("Email submitted successfully");
      setEmail("");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error submitting email:", err);
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
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
              onClick={handleSubmit}
            >
              Subscribe
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
