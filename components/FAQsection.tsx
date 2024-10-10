"use client";

import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="py-7 border-b border-black/30 hover:cursor-pointer hover:bg-gray-200/70 hover:rounded-lg"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center">
        <span className="flex-1 text-lg font-bold">{question}</span>
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </div>
      <div className={clsx("mt-4", { hidden: !isOpen, "": isOpen === true })}>
        {answer}
      </div>
    </div>
  );
};

const FAQsection = () => {
  return (
    <div className="mx-auto py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tighter">
          Frequently asked questions
        </h2>
        <div className="mt-12 max-w-[648px] mx-auto">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsection;
