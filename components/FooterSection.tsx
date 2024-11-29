"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaYoutube, FaTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useEmailModal } from "@/store/EmailModalStore";

import Logo from "./Logo";

function FooterSection() {
  const emailModal = useEmailModal();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const data = {
    company: [
      { name: "About", url: "/about-us" },
      { name: "Blog", url: "/blog" },
    ],
    // support: [
    //   { name: "Help Center", url: "#" },
    //   { name: "API docs", url: "/api" },
    //   { name: "System status", url: "#" },
    // ],
  };

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

      setMessage("Successfully subscribed!");
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 px-6 md:px-24 py-16 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <Logo width={160} height={160} />

          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company
            </p>
            {data.company.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subscribe to our newsletter
            </h3>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="h-10 bg-white dark:bg-slate-800 rounded-lg px-4 font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 text-black dark:text-white border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="h-10 bg-primary dark:bg-primary text-white rounded-lg px-4 hover:bg-primary/90 dark:hover:bg-primary/90 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200 dark:text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {message}
              </p>
            )}
          </div>

          <div className="flex space-x-8">
            <Link
              href="https://www.youtube.com/@Earnings-Wave"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200"
            >
              <FaYoutube className="w-5 h-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="https://x.com/EarningsWaves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] transition-colors duration-200"
            >
              <FaTwitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                emailModal.onOpen();
              }}
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
            >
              <MdEmail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-500 dark:text-gray-400">
          <p className="leading-relaxed">
            Any information on EarningsWave is not a buy or sell signal, nor is
            it financial advice. Options, investing, and trading are risky, and
            losses are more expected than profits. Playing any alert/data may
            result in a complete, or partial, loss in investment. Please do your
            own research before investing. Please only subscribe after reading
            our full terms and understanding options and the market, and the
            inherent risks of trading. It is highly recommended not to trade
            based on this information.
          </p>
          <p className="leading-relaxed">
            Any content on this site or related pages is not intended to provide
            legal, tax, investment, or insurance advice. EarningsWave Inc. is
            not registered as a securities broker-dealer or an investment
            adviser with the U.S. Securities and Exchange Commission, the
            Financial Industry Regulatory Authority (“FINRA”), or any state
            securities regulatory authority. Nothing on EarningsWave should be
            construed as an offer to sell, a solicitation of an offer to buy, or
            a recommendation for any security by EarningsWave or any third
            party. Certain investment planning tools available on EarningsWave
            may provide general investment education based on your input. You
            are solely responsible for determining whether any investment,
            investment strategy, security, or related transaction is appropriate
            for you based on your personal investment objectives, financial
            circumstances, and risk tolerance. You should consult your legal or
            tax professional regarding your specific situation. See terms for
            more information.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FooterSection;
