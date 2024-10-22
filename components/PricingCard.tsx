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
import { User as ClerkUser } from "@clerk/nextjs/server";

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
  user: ClerkUser | null | undefined;
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
      <Card className="flex flex-col h-full border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
          >
            <CardTitle className="text-2xl font-bold text-gray-900">
              {plan.name}
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + 0.1 * index, duration: 0.5 }}
          >
            <CardDescription className="text-4xl font-semibold mt-4 text-gray-900">
              {isAnnual ? plan.annualPrice : plan.monthlyPrice}
              <span className="text-base font-normal text-gray-600">
                / {isAnnual ? "year" : "month"}
              </span>
            </CardDescription>
          </motion.div>
          {isAnnual && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + 0.1 * index, duration: 0.5 }}
              className="text-sm font-medium text-green-600 mt-2"
            >
              Save 20% with annual billing
            </motion.p>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {plan.features.map((feature: any, featureIndex: number) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + 0.05 * featureIndex + 0.1 * index,
                  duration: 0.5,
                }}
                className="flex items-center"
              >
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button
            className="w-full"
            onClick={() => {
              if (user?.id) {
                const priceId = isYearly
                  ? plan.priceIdYearly
                  : plan.priceIdMonthly;
                if (priceId) {
                  handleCheckout(priceId, true);
                } else {
                  console.error("Price ID is undefined");
                  // You might want to show an error message to the user here
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
