"use client";

import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
// import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

function AlertSection() {
  const [showAlert, setShowAlert] = useState(true);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing-section");
    pricingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "bg-primary mx-4 flex justify-between p-2 lg:p-[12px] rounded-[12px] mt-3 lg:mt-4",
            "hidden sm:flex"
          )}
        >
          <div />
          <div className="inline-flex gap-3 text-white font-semibold text-[12px] md:text-[16px]">
            <div>
              Save 20% with annual pricing
              <span
                onClick={scrollToPricing}
                className="underline underline-offset-4 pl-3 cursor-pointer"
              >
                Learn more
              </span>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <PlusIcon
              className="rotate-45 hover:cursor-pointer"
              color="#fff"
              onClick={() => setShowAlert(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AlertSection;
