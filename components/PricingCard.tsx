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
      <Card className="flex flex-col h-full border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl dark:shadow-slate-800/50 dark:hover:shadow-slate-800 transition-shadow duration-300 bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
          >
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {plan.name}
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
          >
            <CardDescription className="text-4xl font-semibold mt-4 text-gray-900 dark:text-gray-200">
              {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                / {isAnnual ? "year" : "month"}
              </span>
            </CardDescription>
          </motion.div>
          {isAnnual && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + 0.1 * index, duration: 0.5 }}
              className="text-sm font-medium text-green-600 dark:text-green-400 mt-2"
            >
              Save 20% with annual billing
            </motion.p>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
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
                className="flex items-center text-gray-700 dark:text-gray-300"
              >
                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button
            className="w-full bg-primary dark:bg-white hover:bg-primary/90 dark:hover:bg-gray-100 text-white dark:text-gray-900 transition-colors duration-300"
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
