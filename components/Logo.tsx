"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import lightImg from "@/public/images/ew-logo-noBG.png";
import darkImg from "@/public/images/ew-logo-dark-noBG.png";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface LogoProps {
  dark?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const img = theme === "dark" ? darkImg : lightImg;

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div
      className={cn(
        "w-48 h-12 relative cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105",
        className
      )}
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
