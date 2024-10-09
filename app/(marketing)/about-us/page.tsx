"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Computer, Globe, TimerIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutUs() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const transition = {
    duration: 0.6,
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <section className="px-4 pt-40 md:px-6 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800"
            variants={fadeInUp}
            transition={transition}
          >
            About Us
          </motion.h2>

          <motion.p
            className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto"
            variants={fadeInUp}
            transition={transition}
          >
            EarningsWave is an innovative API platform that provides investors
            and financial analysts with AI-powered, real-time data on earnings
            calls and financial reports, enabling users to access unique
            insights and make informed investment decisions.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerChildren}
          >
            {[
              {
                icon: Globe,
                title: "Comprehensive Coverage",
                description:
                  "Access AI-analyzed data from earnings calls and financial reports across a wide range of companies and sectors.",
              },
              {
                icon: TimerIcon,
                title: "Real-Time Insights",
                description:
                  "Get up-to-the-minute analysis and key takeaways from earnings calls as they happen.",
              },
              {
                icon: Computer,
                title: "AI-Powered Analysis",
                description:
                  "Leverage advanced AI algorithms to extract valuable insights and trends from complex financial data.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={transition}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <item.icon className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center"
            variants={fadeInUp}
            transition={transition}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              We're revolutionizing financial analysis by providing instant,
              AI-powered insights from earnings calls and reports. EarningsWave
              democratizes access to premium financial data, simplifying
              investment research and fostering more informed decision-making in
              the financial markets.
            </p>
            <div className="flex justify-center items-center">
              <Link href="/dashboard">
                <Button className="flex items-center justify-center">
                  <span className="mb-1">Explore Our API</span>
                  <ArrowRightIcon className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
      <section id="how-it-works" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How It Works
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            EarningsWave simplifies the process of accessing and analyzing
            financial data in three easy steps:
          </p>
          <ol className="mt-8 space-y-4 text-left">
            <li>
              <strong>1. Connect:</strong> Integrate our API into your existing
              financial analysis tools or platforms.
            </li>
            <li>
              <strong>2. Query:</strong> Request real-time data on specific
              companies, sectors, or earnings events.
            </li>
            <li>
              <strong>3. Analyze:</strong> Receive AI-processed insights and key
              takeaways to inform your investment decisions.
            </li>
          </ol>
        </div>
      </section>
      <section id="join" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Join the Financial Data Revolution
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            EarningsWave is transforming financial analysis with AI-powered
            insights. Don't fall behind.
          </p>
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ size: "lg" }), "mt-4")}
          >
            Start Investing Today
          </Link>
        </div>
      </section>
    </>
  );
}
