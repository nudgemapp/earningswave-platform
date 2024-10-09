import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

import img from "@/public/images/ew-logo-dark.png";
function FooterSection() {
  const data = {
    product: ["Changelog", "Customer stories", "Security"],
    company: ["About", "Careers", "Blog", "Startip program"],
    attioFor: ["Startups", "Investors"],
    support: ["Help Center", "Talk to support", "API docs", "System status"],
  };
  return (
    <section className="bg-[#232529] px-4 md:px-[94px] py-[90px]">
      <div className="w-48 h-12 relative">
        <Image
          src={img}
          alt="logo"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="mt-[32px] pb-[50px] flex justify-between w-full gap-8 flex-col md:flex-row flex-wrap">
        <div>
          <p className="text-[#9098A0] mb-[12px]">Product</p>
          <div className="flex flex-col gap-3">
            {data.product.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">Company</p>
          <div className="flex flex-col gap-3">
            {data.company.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">EarningsWave for</p>
          <div className="flex flex-col gap-3">
            {data.attioFor.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[#9098A0] mb-[12px]">Support</p>
          <div className="flex flex-col gap-3">
            {data.support.map((item, index) => (
              <p key={index} className="text-[#555E67] hover:cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="min-w-[300px]">
          <p className="font-medium text-[#9098A0] mb-4">Ready to build?</p>
          <div className="flex flex-col gap-[12px] justify-start">
            <Button className="border-none bg-[#31373D] hover:bg-[#31373D] rounded-[12px]">
              Start for free
            </Button>
            <Button className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-transparent hover:bg-transparent text-white">
              Talk to sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterSection;
