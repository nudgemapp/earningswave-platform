"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEmailModal } from "@/store/EmailModalStore";
import PricingSection from "@/components/PricingSection";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useApiClient } from "@/lib/apiClient";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const ApiClientPage = () => {
  const emailModal = useEmailModal();
  const { user } = useUser();
  const apiClient = useApiClient();
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async () => {
    console.log("user", user?.id);
    console.log("email", user?.emailAddresses[0].emailAddress);

    const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_API_PRICE_ID;
    const subscription = true;

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
      console.error(error);
      return;
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 py-8 overflow-x-clip mt-24 sm:mt-0"
    >
      <div className="mx-auto pb-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-[540px] mx-auto flex flex-col items-center"
        >
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter mt-5 text-gray-900 dark:text-gray-100">
            Earnings call transcripts on demand: Flexible access for every need
          </h2>
          <p className="text-center text-[18px] sm:text-[22px] leading-[28px] sm:leading-[30px] tracking-tight text-gray-600 dark:text-gray-300 mt-5 mb-8 font-medium sm:font-normal">
            Tailor your transcript access to your specific requirements. Whether
            you need bulk historical data, real-time updates, or targeted
            searches, our flexible API allows you to retrieve exactly the
            information you need, when you need it.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 flex justify-center space-x-4 mt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12 bg-primary hover:bg-primary/90 text-white dark:text-white shadow-sm dark:shadow-slate-800/50 transition-all duration-300 dark:text-black"
              onClick={handleCheckout}
            >
              Get API
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => emailModal.onOpen()}
              variant="outline"
            >
              Talk to Sales
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <PricingSection showTitle={false} showTraderCard={false} />
    </motion.section>
  );
};

export default ApiClientPage;
