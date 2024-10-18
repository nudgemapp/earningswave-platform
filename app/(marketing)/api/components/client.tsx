"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEmailModal } from "@/store/EmailModalStore";
import PricingSection from "@/components/PricingSection";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { loadStripe } from "@stripe/stripe-js";
import { useApiClient } from "@/lib/apiClient";
import { useState, useEffect } from "react";

const ApiClientPage = () => {
  const emailModal = useEmailModal();
  const { user, isLoading } = useUser();
  const router = useRouter();
  const apiClient = useApiClient();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const handleCheckout = async () => {
    console.log("user", user?.sub);
    console.log("email", user?.email);

    const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_API_PRICE_ID;
    const subscription = true;

    try {
      const { data } = await apiClient.post(
        "/payments/create-checkout-session",
        {
          userId: user?.sub,
          email: user?.email,
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFFF] py-8 overflow-x-clip mt-24 sm:mt-0"
    >
      <div className="mx-auto pb-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-[540px] mx-auto flex flex-col items-center"
        >
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter mt-5">
            Earnings call transcripts on demand: Flexible access for every need
          </h2>
          <p className="text-center text-[18px] sm:text-[22px] leading-[28px] sm:leading-[30px] tracking-tight text-[#010D3E] mt-5 mb-8 font-medium sm:font-normal">
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
              className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12"
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
