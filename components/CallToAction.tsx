"use client";

import React, { useState } from "react";

const CallToAction = () => {
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

      setMessage("Account creation succesfull!");
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
    <div className="py-[72px] sm:py-24 text-center bg-white dark:bg-slate-900">
      <div className="container max-w-xl relative mx-auto">
        <h2 className="font-bold text-5xl tracking-tighter sm:text-6xl text-black dark:text-white">
          Get instant access
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-5">
          Explore all of our carefully crafted APIs for your next investment
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="h-12 bg-white dark:bg-slate-800 rounded-lg p-5 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-black dark:text-white border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary dark:bg-primary text-white h-12 rounded-lg px-5 hover:bg-primary/90 dark:hover:bg-primary/90 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200 dark:text-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Get access"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CallToAction;
