"use client";

import Image from "next/image";

import img from "@/public/images/ew-logo.svg";

const Logo = () => {
  return (
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
  );
};

export default Logo;
