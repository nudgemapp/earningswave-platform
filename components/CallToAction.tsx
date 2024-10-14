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
    <div className="py-[72px] sm:py-24 text-center bg-gradient-to-b from-white to-[#232529]">
      <div className="container max-w-xl relative mx-auto">
        <h2 className="font-bold text-5xl tracking-tighter sm:text-6xl">
          Get instant access
        </h2>
        <p className="text-xl text-white mt-5">
          Explore all of our carefully crafted APIs for your next investment
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-2.5 max-w-sm mx-auto sm:flex-row"
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="h-12 bg-white rounded-lg p-5 font-medium placeholder:text-[#9CA3AF] flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white h-12 rounded-lg px-5 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Get access"}
          </button>
        </form>
        {message && <p className="mt-4 text-white">{message}</p>}
      </div>
    </div>
  );
};

export default CallToAction;
