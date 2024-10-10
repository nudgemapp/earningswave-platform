"use client";

import React, { useState } from "react";

const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/collect-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Email collected successfully!");
        setEmail("");
      } else {
        const data = await response.json();
        setMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Get access"}
          </button>
        </form>
        {message && <p className="mt-4 text-white">{message}</p>}
      </div>
    </div>
  );
};

export default CallToAction;
