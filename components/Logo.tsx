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
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className, width = 80, height = 80 }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const img = theme === "dark" ? darkImg : lightImg;

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div
      className={cn(
        "font-normal flex space-x-2 items-center text-sm text-black relative z-20",
        className
      )}
      onClick={handleClick}
    >
      <Image
        src={img}
        alt="EarningsWave Logo"
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
