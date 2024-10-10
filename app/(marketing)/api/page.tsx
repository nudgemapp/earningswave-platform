"use client";

import { motion } from "framer-motion";
import { EmailModal } from "@/components/modals/email-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const APIPage = () => {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFFF] py-8  overflow-x-clip mt-24 sm:mt-0"
    >
      <div className="mx-auto pb-40">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-[540px] mx-auto flex flex-col items-center"
        >
          <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
            Boost your productivity
          </div>
          <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
            Earnings call transcripts on demand: Flexible access for every need
          </h2>
          <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
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
              className="border-none rounded-[12px]"
              onClick={() => router.push("/")}
            >
              View docs
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <EmailModal title="Book a call" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
    // <motion.section
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   transition={{ duration: 0.5 }}
    //   className="space-y-12 py-20 md:py-32 text-center"
    // >
    //   <div className="container flex max-w-[64rem] flex-col items-center gap-4 mx-auto">
    //     <motion.h1
    //       initial={{ y: -20 }}
    //       animate={{ y: 0 }}
    //       transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
    //       className="font-bold text-4xl lg:text-5xl pb-4"
    //     >
    //       Earnings call transcripts on demand: Flexible access for every need{" "}
    //     </motion.h1>
    //     <motion.p
    //       initial={{ y: 20, opacity: 0 }}
    //       animate={{ y: 0, opacity: 1 }}
    //       transition={{ delay: 0.4, duration: 0.5 }}
    //       className="text-xl text-muted-foreground"
    //     >
    //       Tailor your transcript access to your specific requirements. Whether
    //       you need bulk historical data, real-time updates, or targeted
    //       searches, our flexible API allows you to retrieve exactly the
    //       information you need, when you need it.{" "}
    //     </motion.p>
    //   </div>
    // <motion.div
    //   initial={{ y: 50, opacity: 0 }}
    //   animate={{ y: 0, opacity: 1 }}
    //   transition={{ delay: 0.6, duration: 0.5 }}
    //   className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 space-y-8"
    // >
    //   <motion.div
    //     whileHover={{ scale: 1.05 }}
    //     whileTap={{ scale: 0.95 }}
    //     className="inline-block mr-4"
    //   >
    //     <EmailModal title="Book a call" />
    //   </motion.div>
    //   <motion.div
    //     whileHover={{ scale: 1.05 }}
    //     whileTap={{ scale: 0.95 }}
    //     className="inline-block"
    //   >
    //     <a
    //       href="/api-docs"
    //       className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
    //     >
    //       View docs
    //     </a>
    //   </motion.div>
    // </motion.div>
    // </motion.section>
  );
};

export default APIPage;
