"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

import img from "@/public/images/ew-logo-dark-noBG.png";

function FooterSection() {
  const router = useRouter();

  const data = {
    company: [
      { name: "About", url: "/about-us" },
      { name: "Careers", url: "#" },
      { name: "Blog", url: "/blog" },
      { name: "Startup program", url: "#" },
    ],
    support: [
      { name: "Help Center", url: "#" },
      { name: "Talk to support", url: "#" },
      { name: "API docs", url: "/api" },
      { name: "System status", url: "#" },
    ],
  };
  return (
    <section className="bg-white dark:bg-slate-900 px-4 md:px-[94px] py-[90px] border-t border-gray-200 dark:border-slate-700">
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
          <p className="text-gray-800 dark:text-gray-200 mb-[12px] font-medium">
            Company
          </p>
          <div className="flex flex-col gap-3">
            {data.company.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-800 dark:text-gray-200 mb-[12px] font-medium">
            Support
          </p>
          <div className="flex flex-col gap-3">
            {data.support.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="min-w-[300px]">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-4">
            Ready to build?
          </p>
          <div className="flex flex-col gap-[12px] justify-start">
            <Button
              className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-[12px] transition-colors duration-200"
              onClick={() => router.push("/sign-up")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterSection;
