"use client";

import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { EmailModal } from "./modals/email-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

import img from "@/public/images/ew-logo-dark-noBG.png";
function FooterSection() {
  const router = useRouter();
  const data = {
    product: [
      { name: "Changelog", url: "#" },
      { name: "Customer stories", url: "#" },
      { name: "Security", url: "#" },
    ],
    company: [
      { name: "About", url: "/about-us" },
      { name: "Careers", url: "#" },
      { name: "Blog", url: "#" },
      { name: "Startup program", url: "#" },
    ],
    attioFor: [
      { name: "Startups", url: "#" },
      { name: "Investors", url: "#" },
    ],
    support: [
      { name: "Help Center", url: "#" },
      { name: "Talk to support", url: "#" },
      { name: "API docs", url: "#" },
      { name: "System status", url: "#" },
    ],
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
          <p className="text-white mb-[12px] font-medium">Product</p>
          <div className="flex flex-col gap-3">
            {data.product.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-[#E0E0E0] hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white mb-[12px] font-medium">Company</p>
          <div className="flex flex-col gap-3">
            {data.company.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-[#E0E0E0] hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white mb-[12px] font-medium">EarningsWave for</p>
          <div className="flex flex-col gap-3">
            {data.attioFor.map((item, index) => (
              <p
                key={index}
                className="text-[#E0E0E0] hover:cursor-pointer hover:text-white"
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white mb-[12px] font-medium">Support</p>
          <div className="flex flex-col gap-3">
            {data.support.map((item, index) => (
              <p
                key={index}
                className="text-[#E0E0E0] hover:cursor-pointer hover:text-white"
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
        <div className="min-w-[300px]">
          <p className="font-medium text-white mb-4">Ready to build?</p>
          <div className="flex flex-col gap-[12px] justify-start">
            <Button
              className="border-none bg-[#31373D] hover:bg-[#31373D] text-white rounded-[12px]"
              onClick={() => router.push("/sign-up")}
            >
              Start for free
            </Button>
            <EmailModal />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterSection;