"use client";

import { useState, useEffect } from "react";
import { MenuIcon, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Image from "next/image";
import lightImg from "@/public/images/ew-logo-noBG.png";

function useMount() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

function NavBar() {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const mounted = useMount();

  const links = [
    {
      route: "/earnings",
      name: "Earnings",
      badgeCount: 0,
    },
    {
      name: "Company",
      dropdownItems: [
        { name: "About Us", route: "/about-us" },
        { name: "Docs", route: "/docs" },
        { name: "Blog", route: "/blog" },
      ],
    },
    {
      route: "/api",
      name: "API",
      badgeCount: 0,
    },
  ];

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const handleNavigation = (route: string) => {
    router.push(route);
    if (menu) {
      setMenu(false);
    }
  };

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="md:sticky md:top-0 md:shadow-none z-20 md:mt-0"
        >
          {/* DESKTOP */}
          <div className="hidden lg:block bg-white p-4">
            <div className="flex items-center mx-4">
              {/* Logo - Left */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-shrink-0 w-1/4"
              >
                <Logo />
              </motion.div>

              {/* Links - Center */}
              <div className="flex-grow flex justify-center gap-[20px] xl:gap-[50px] text-[16px] items-center select-none">
                {links.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-2 relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.dropdownItems ? (
                      <>
                        <p className="hover:text-primary cursor-pointer flex items-center gap-2 font-[500] text-gray transition-colors duration-200 relative">
                          {item.name}
                          <ChevronDown
                            size={16}
                            className="group-hover:rotate-180 transition-transform duration-200"
                          />
                          <motion.div
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        </p>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                          <div className="py-2">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <p
                                  key={dropdownIndex}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 text-gray-700"
                                  onClick={() =>
                                    handleNavigation(dropdownItem.route)
                                  }
                                >
                                  {dropdownItem.name}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p
                        className={`hover:text-primary cursor-pointer flex items-center gap-2 font-[500] text-gray relative`}
                        onClick={() => handleNavigation(item.route)}
                      >
                        {item.name}
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </p>
                    )}
                    {item.badgeCount ? (
                      <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                        {item.badgeCount}
                      </div>
                    ) : (
                      <div />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Buttons - Right */}
              <div className="flex-shrink-0 w-1/4 flex justify-end items-center gap-[20px] select-none">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-white border text-[#31373D] border-[#EDEEF0] hover:bg-white"
                    onClick={() => router.push("/sign-in")}
                  >
                    Sign in
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => router.push("/sign-up")}>
                    Sign up{" "}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="block lg:hidden fixed inset-0 z-[999] bg-white">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <button onClick={toggleMenu} className="p-2 z-10">
                  {menu ? (
                    <X className="w-6 h-6 text-gray-800" />
                  ) : (
                    <MenuIcon className="w-6 h-6 text-gray-800" />
                  )}
                </button>
                <div
                  className="relative right-16 w-48 h-14 z-0"
                  onClick={() => handleNavigation("/")}
                >
                  <Image
                    src={lightImg}
                    alt="logo"
                    fill
                    sizes="(max-width: 768px) 100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              {!menu && (
                <Button
                  className="text-sm px-4 py-2 rounded-full"
                  onClick={() => router.push("/sign-up")}
                >
                  Sign Up
                </Button>
              )}
            </div>
            {menu && (
              <div className="h-[calc(100vh-56px)] flex flex-col justify-between bg-white">
                <nav className="flex-grow flex flex-col justify-center items-center px-6 py-8">
                  {links.map((item, index) => (
                    <div key={index} className="text-center w-full">
                      {item.dropdownItems ? (
                        <div className="py-6">
                          <p className="font-semibold text-gray-800 mb-4 text-2xl">
                            {item.name}
                          </p>
                          <div className="space-y-4">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <p
                                  key={dropdownIndex}
                                  className="text-gray-600 hover:text-primary cursor-pointer transition-colors duration-200 text-xl"
                                  onClick={() =>
                                    handleNavigation(dropdownItem.route)
                                  }
                                >
                                  {dropdownItem.name}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <p
                          className="font-semibold text-gray-800 hover:text-primary cursor-pointer transition-colors duration-200 text-2xl py-6"
                          onClick={() => handleNavigation(item.route)}
                        >
                          {item.name}
                        </p>
                      )}
                      {index < links.length - 1 && (
                        <div className="w-1/2 h-px bg-gray-200 mx-auto my-2"></div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="px-6 py-6 bg-gray-50">
                  <Button
                    className="w-full mb-4 bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-200 text-xl py-4"
                    onClick={() => router.push("/sign-in")}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full text-xl py-4"
                    onClick={() => router.push("/sign-up")}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NavBar;
