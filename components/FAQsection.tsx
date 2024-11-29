"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

const items = [
  {
    id: 1,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, including Visa, MasterCard, and American Express. We also support payments via PayPal and bank transfers for annual subscriptions.",
  },
  {
    id: 2,
    question: "How does the pricing work for teams?",
    answer:
      "Our team pricing is based on the number of users and API calls. We offer tiered plans that provide increasing benefits and API access as your team grows. Custom enterprise solutions are also available for large organizations.",
  },
  {
    id: 3,
    question: "Can I change my plan later?",
    answer:
      "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will be reflected in your next billing cycle.",
  },
  {
    id: 4,
    question: "Is my data secure?",
    answer:
      "Yes, we take data security very seriously. We use industry-standard encryption protocols, regular security audits, and comply with financial industry regulations to ensure your data remains protected and confidential.",
  },
  {
    id: 5,
    question: "How frequently is the financial data updated?",
    answer:
      "Our APIs provide real-time data during market hours. Historical data and after-hours updates are processed and made available as quickly as possible, typically within minutes of release.",
  },
];

const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900"
      initial={false}
    >
      <motion.header
        className="py-7 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.span
          className="flex-1 text-lg font-bold text-gray-900 dark:text-gray-200"
          initial={false}
        >
          {question}
        </motion.span>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-600 dark:text-gray-400"
        >
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", marginBottom: 15 },
              collapsed: { opacity: 0, height: 0, marginBottom: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.4 }}
              className="text-gray-600 dark:text-white"
            >
              {answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQsection = () => {
  return (
    <motion.div
      className="mx-auto sm-24 bg-white dark:bg-slate-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <motion.h2
          className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tighter text-gray-900 dark:text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Frequently asked questions
        </motion.h2>
        <motion.div
          className="mt-12 max-w-[648px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FAQsection;
