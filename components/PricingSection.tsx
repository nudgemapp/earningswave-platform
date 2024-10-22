"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { loadStripe } from "@stripe/stripe-js";
import { useApiClient } from "@/lib/apiClient";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface PricingSectionProps {
  showTitle?: boolean;
  showTraderCard?: boolean;
}

function PricingSection({
  showTitle = true,
  showTraderCard = true,
}: PricingSectionProps) {
  const pricingPlans = [
    {
      name: "Trader 🚀 ",
      monthlyPrice: "$49.99",
      annualPrice: "$479.90",
      features: [
        "Live Earnings Calendar",
        "Earnings Expectations vs. Reported Numbers",
        "Earnings Reports from 5+ years",
        "News on Thousands of Tickers",
        "Company Earnings Reports",
        "Daily News Digest",
        "Weekly News Digest",
      ],
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_TRADER_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_TRADER_PRICE_ID,
      actionLabel: "Get Started",
    },
    {
      name: "API ⚡",
      monthlyPrice: "$199.99",
      annualPrice: "$1,919.90",
      features: [
        "All US Stocks Tickers",
        "Unlimited API Calls",
        "5 Years Historical Earnings Data",
        "100% Market Coverage",
        "Searchable data",
        "Unlimited File Downloads",
        "Claude integration",
        "Fundamentals Data",
        "WebSockets",
        "Snapshot",
      ],
      actionLabel: "Get Started",
      priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_API_PRICE_ID,
      priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_API_PRICE_ID,
      popular: true,
    },
  ];

  const { user, isLoaded } = useUser();

  console.log(user);

  const [isYearly, setIsYearly] = useState<boolean>(false);

  // Update this function to correctly set the isYearly state
  const togglePricingPeriod = (value: string) => {
    setIsYearly(value === "annual");
  };

  // const stripePromise = loadStripe(
  //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  // );

  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const apiClient = useApiClient();

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    console.log("user", user?.id);
    console.log("email", user?.emailAddresses[0].emailAddress);
    console.log("priceId", priceId);
    console.log("subscription", subscription);

    try {
      const { data } = await apiClient.post(
        "/payments/create-checkout-session",
        {
          userId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
          priceId,
          subscription,
        }
      );
      console.log(data);

      if (data.sessionId) {
        const stripe = await stripePromise;
        console.log(stripe);

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });
        console.log(response);

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
      className="container mx-auto py-20 px-4 md:px-8 lg:px-20 xl:px-32"
    >
      {showTitle && (
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-12"
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
          <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-gray-100 p-1 text-gray-600">
            <TabsTrigger
              value="monthly"
              className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="rounded-full px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
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

interface PricingCardProps {
  handleCheckout: any;
  user: any;
  plan: any;
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
                handleCheckout(
                  isYearly ? plan.priceIdYearly : plan.priceIdMonthly,
                  true
                );
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

export default PricingSection;
