"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

import { useRouter } from "next/navigation";
import { UserResource } from "@clerk/types";

interface Plan {
  name: string;
  annualPrice: string;
  monthlyPrice: string;
  features: string[];
  priceIdYearly: string | undefined;
  priceIdMonthly: string | undefined;
  actionLabel: string;
  popular?: boolean;
}

interface PricingCardProps {
  handleCheckout: (priceId: string, isSubscription: boolean) => void;
  user: UserResource | null | undefined;
  plan: Plan;
  isAnnual: boolean;
  index: number;
  isYearly: boolean;
}

function PricingCard({
  handleCheckout,
  plan,
  isAnnual,
  index,
  user,
  isYearly,
}: PricingCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="h-full"
    >
      <Card
        className={`
          relative flex flex-col h-full
          border border-gray-200 dark:border-gray-800 rounded-xl
          ${
            plan.popular
              ? "bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
              : "bg-white dark:bg-slate-900"
          }
          shadow-sm hover:shadow-md
          transform hover:-translate-y-1 transition-all duration-300
        `}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
              MOST POPULAR
            </span>
          </div>
        )}

        <CardHeader className="text-center pb-4 pt-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
          >
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              {plan.name}
              {plan.name.toLowerCase().includes("trader") && (
                <span role="img" aria-label="rocket" className="text-xl">
                  🚀
                </span>
              )}
              {plan.name.toLowerCase().includes("api") && (
                <span role="img" aria-label="lightning" className="text-xl">
                  ⚡️
                </span>
              )}
            </CardTitle>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
            className="mt-3"
          >
            <CardDescription className="flex items-baseline justify-center gap-1.5">
              <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                /{isAnnual ? "yr" : "mo"}
              </span>
            </CardDescription>
          </motion.div>

          {isAnnual && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + 0.1 * index, duration: 0.5 }}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2"
            >
              20% discount applied
            </motion.p>
          )}
        </CardHeader>

        <CardContent className="flex-grow px-6">
          <ul className="space-y-3">
            {plan.features.map((feature: string, featureIndex: number) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + 0.05 * featureIndex + 0.1 * index,
                  duration: 0.5,
                }}
                className="flex items-start gap-2"
              >
                <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-300 leading-tight">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-6 pt-4">
          <Button
            className={`
              w-full py-4 text-sm font-semibold tracking-wide rounded-lg
              ${
                plan.popular
                  ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
              }
              transition-colors duration-200
            `}
            onClick={() => {
              if (user?.id) {
                const priceId = isYearly
                  ? plan.priceIdYearly
                  : plan.priceIdMonthly;
                if (priceId) {
                  handleCheckout(priceId, true);
                }
              } else {
                router.push("/sign-up");
              }
            }}
          >
            {plan.actionLabel}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default PricingCard;
