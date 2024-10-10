"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import lightImg from "@/public/images/ew-logo-noBG.png";
import darkImg from "@/public/images/ew-logo-dark-noBG.png";

interface LogoProps {
  dark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ dark = false }) => {
  const router = useRouter();
  const img = dark ? darkImg : lightImg;

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div
      className="w-48 h-12 relative cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={handleClick}
    >
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
