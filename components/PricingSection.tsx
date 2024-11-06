"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useApiClient } from "@/lib/apiClient";
import { useUser } from "@clerk/nextjs";
import { pricingPlans } from "@/app/data";
import PricingCard from "./PricingCard";

interface PricingSectionProps {
  showTitle?: boolean;
  showTraderCard?: boolean;
}

function PricingSection({
  showTitle = true,
  showTraderCard = true,
}: PricingSectionProps) {
  const { user } = useUser();

  const [isYearly, setIsYearly] = useState<boolean>(false);

  // Update this function to correctly set the isYearly state
  const togglePricingPeriod = (value: string) => {
    setIsYearly(value === "annual");
  };

  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const apiClient = useApiClient();

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    try {
      interface CheckoutSessionResponse {
        sessionId: string;
      }

      const { data } = await apiClient.post<CheckoutSessionResponse>(
        "/payments/create-checkout-session",
        {
          userId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
          priceId,
          subscription,
        }
      );

      if (data.sessionId) {
        const stripe = await stripePromise;
        console.log(stripe);

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        return response;
      } else {
        console.error("No sessionId found");
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <motion.div
      id="pricing-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-20 px-4 md:px-8 lg:px-20 xl:px-32 bg-white dark:bg-slate-900"
    >
      {showTitle && (
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-200 mb-12"
        >
          Transparent Pricing for Every Need
        </motion.h2>
      )}
      <Tabs
        defaultValue="monthly"
        className="w-full max-w-5xl mx-auto"
        onValueChange={togglePricingPeriod}
      >
        <div className="flex justify-center mb-12">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 p-1 text-gray-600 dark:text-gray-400">
            <TabsTrigger
              value="monthly"
              className="rounded-full px-4 py-2 text-sm font-medium transition-all 
                data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
                data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-200 
                data-[state=active]:shadow-sm dark:data-[state=active]:shadow-slate-800/50"
            >
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="rounded-full px-4 py-2 text-sm font-medium transition-all 
                data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
                data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-200 
                data-[state=active]:shadow-sm dark:data-[state=active]:shadow-slate-800/50"
            >
              Annual Billing
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="monthly">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`${
              showTraderCard
                ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                : "flex justify-center"
            }`}
          >
            {pricingPlans
              .filter((plan) => showTraderCard || plan.name !== "Trader 🚀 ")
              .map((plan, index) => (
                <div
                  key={plan.name}
                  className={showTraderCard ? "h-full" : "w-full max-w-md"}
                >
                  <PricingCard
                    plan={plan}
                    isAnnual={false}
                    index={index}
                    handleCheckout={(priceId: string, subscription: boolean) =>
                      handleCheckout(priceId, subscription)
                    }
                    user={user}
                    isYearly={isYearly}
                  />
                </div>
              ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="annual">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`${
              showTraderCard
                ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                : "flex justify-center"
            }`}
          >
            {pricingPlans
              .filter((plan) => showTraderCard || plan.name !== "Trader 🚀 ")
              .map((plan, index) => (
                <div
                  key={plan.name}
                  className={showTraderCard ? "h-full" : "w-full max-w-md"}
                >
                  <PricingCard
                    plan={plan}
                    isAnnual={true}
                    index={index}
                    handleCheckout={(priceId: string, subscription: boolean) =>
                      handleCheckout(priceId, subscription)
                    }
                    user={user}
                    isYearly={isYearly}
                  />
                </div>
              ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default PricingSection;
