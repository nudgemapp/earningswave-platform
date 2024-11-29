"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { loadStripe, Stripe } from "@stripe/stripe-js";
// import { useApiClient } from "@/lib/apiClient";
// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import example1 from "@/public/images/example1.webp";
import ApiInfoSection from "@/components/apiInfoSection";
import StatisticsSection from "@/components/statisticsSections";
import CoverageApiSection from "@/components/coverageApiSection";
import CarouselSection from "@/components/carouselSection";

const ApiClientPage = () => {
  // const { user } = useUser();
  // const apiClient = useApiClient();
  // const [stripePromise, setStripePromise] =
  //   useState<Promise<Stripe | null> | null>(null);

  // useEffect(() => {
  //   setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  // }, []);

  // const handleCheckout = async () => {
  //   console.log("user", user?.id);
  //   console.log("email", user?.emailAddresses[0].emailAddress);

  //   const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_API_PRICE_ID;
  //   const subscription = true;

  //   try {
  //     interface CheckoutSessionResponse {
  //       sessionId: string;
  //     }

  //     const { data } = await apiClient.post<CheckoutSessionResponse>(
  //       "/payments/create-checkout-session",
  //       {
  //         userId: user?.id,
  //         email: user?.emailAddresses[0].emailAddress,
  //         priceId,
  //         subscription,
  //       }
  //     );

  //     console.log(data);

  //     if (data.sessionId) {
  //       const stripe = await stripePromise;
  //       console.log(stripe);

  //       const response = await stripe?.redirectToCheckout({
  //         sessionId: data.sessionId,
  //       });
  //       console.log(response);

  //       return response;
  //     } else {
  //       console.error("No sessionId found");
  //       return;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return;
  //   }
  // };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-900 py-8 overflow-x-clip mt-24 sm:mt-0"
    >
      <div className="container mx-auto pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter mt-5 text-gray-900 dark:text-gray-100">
              Earnings Intel API: Every Call, Every Estimate, Every Quarter{" "}
            </h2>
            <p className="text-[18px] sm:text-[22px] leading-[28px] sm:leading-[30px] tracking-tight text-gray-600 dark:text-gray-300 mt-5 mb-8 font-medium sm:font-normal">
              Get instant access to the earnings data that matters. Our API
              delivers comprehensive earnings call transcripts, estimates, and
              audio across global markets - all through simple, reliable
              endpoints.
            </p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex space-x-4 mt-8"
            >
              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12 bg-primary hover:bg-primary/90 text-white shadow-sm dark:shadow-slate-800/50 transition-all duration-300 dark:text-black"
                  onClick={handleCheckout}
                >
                  Get API
                </Button>
              </motion.div> */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  onClick={() =>
                    window.open(
                      "https://calendly.com/matthew-earningswave/discovery-call"
                    )
                  }
                  variant="outline"
                >
                  Talk to Sales
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center"
          >
            <Image
              src={example1}
              alt="API Client Image"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </motion.div>
        </div>
      </div>
      <ApiInfoSection />
      <StatisticsSection />
      <CarouselSection />
      <CoverageApiSection />
    </motion.section>
  );
};

export default ApiClientPage;
