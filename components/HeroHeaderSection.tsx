import { ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";

function HeroHeaderSection() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleClick = () => {
    router.push("/sign-up");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="hidden sm:block"
    >
      <motion.div
        className="flex justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="inline-flex items-center gap-1 bg-[#F4F5F6] p-1 rounded-[100px] pr-[10px] cursor-pointer max-w-full sm:max-w-none"
          whileHover={{ backgroundColor: "#E8E9EA" }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
        >
          <div className="text-white inline-block bg-primary p-1 sm:p-2 rounded-[100px] text-[8px] sm:text-[10px] font-semibold">
            New
          </div>
          <p className="text-[#31373D] text-[10px] sm:text-base">
            Use EarningsWave to power your next investment
          </p>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hidden sm:block"
          >
            <ChevronRight />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HeroHeaderSection;
