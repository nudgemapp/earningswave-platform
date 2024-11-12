"use client";

import { useState, useEffect } from "react";
import { MenuIcon, X, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Image from "next/image";
import lightImg from "@/public/images/ew-logo-noBG.png";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useEarningsStore } from "@/store/EarningsStore";
import NotificationButton from "./NotificationButton";
import { ModeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import darkImg from "@/public/images/ew-logo-dark-noBG.png";
import { useSearch } from "@/hooks/use-search";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { IconUser } from "@tabler/icons-react";
import { useAuthModal } from "@/store/AuthModalStore";
import { dark } from "@clerk/themes";

// import TickerSearch from "./tickerSearch";

function useMount() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { mounted, user, isLoaded };
}

function NavBar() {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const { mounted, user, isLoaded } = useMount();
  const { signOut } = useClerk();
  const { setSelectedCompany, setSelectedFutureEarnings } = useEarningsStore();
  const { theme } = useTheme();
  const img = theme === "dark" ? darkImg : lightImg;
  const { toggle } = useSearch();

  const links = [
    {
      route: "/",
      name: "Earnings",
      badgeCount: 0,
    },
    {
      name: "Company",
      dropdownItems: [
        { name: "Marketing", route: "/marketing" },
        { name: "Pricing", route: "/pricing" },
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
    if (route === "/") {
      setSelectedCompany(null);
      setSelectedFutureEarnings(null);
    }
    router.push(route);
    if (menu) {
      setMenu(false);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      signOut(() => router.push("/"));
    } else {
      router.push("/sign-up");
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

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
          <div className="hidden lg:block bg-white dark:bg-slate-900 p-2">
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
                        <p className="hover:text-primary cursor-pointer flex items-center gap-2 font-[500] text-black dark:text-white transition-colors duration-200 relative">
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
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-800/50 rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                          <div className="py-2">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <p
                                  key={dropdownIndex}
                                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors duration-150 text-black dark:text-white"
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
                        className="hover:text-primary cursor-pointer flex items-center gap-2 font-[500] text-black dark:text-white relative"
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

              {/* Button - Right */}
              <div className="flex-shrink-0 w-1/4 flex justify-end items-center gap-[20px] select-none">
                <ModeToggle />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggle()}
                    className="relative"
                  >
                    <Search className="h-5 w-5" />
                    {/* <kbd className="pointer-events-none absolute top-5 right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                      <span className="text-xs">⌘</span>K
                    </kbd> */}
                  </Button>
                </motion.div>
                {user && <NotificationButton />}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  {isLoaded ? (
                    user ? (
                      <UserButton
                        appearance={{
                          baseTheme: theme === "dark" ? dark : undefined,
                        }}
                      />
                    ) : (
                      <Avatar
                        onClick={() => useAuthModal.getState().onOpen()}
                        className="cursor-pointer hover:opacity-80"
                      >
                        <AvatarFallback className="flex items-center justify-center">
                          <IconUser className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div className="block lg:hidden fixed inset-0 z-[999] bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <button onClick={toggleMenu} className="p-2 z-10">
                  {menu ? (
                    <X className="w-6 h-6 text-black dark:text-white" />
                  ) : (
                    <MenuIcon className="w-6 h-6 text-black dark:text-white" />
                  )}
                </button>
                <div
                  className="relative right-16 w-48 h-14 z-0"
                  onClick={() => handleNavigation("/")}
                >
                  <Image
                    src={img}
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
                  className="text-base px-6 py-3 rounded-full font-bold"
                  onClick={handleAuthAction}
                >
                  {!isLoaded ? "Loading..." : user ? "Logout" : "Sign up"}
                </Button>
              )}
            </div>
            {menu && (
              <div className="h-[calc(100vh-56px)] flex flex-col justify-between bg-white dark:bg-slate-900 overflow-hidden">
                <nav className="flex-grow flex flex-col justify-center items-center px-6">
                  {links.map((item, index) => (
                    <div key={index} className="text-center w-full">
                      {item.dropdownItems ? (
                        <div className="py-6">
                          <p className="font-semibold text-black dark:text-white mb-4 text-2xl">
                            {item.name}
                          </p>
                          <div className="space-y-4">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <p
                                  key={dropdownIndex}
                                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors duration-200 text-xl"
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
                          className="font-semibold text-black dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer transition-colors duration-200 text-2xl py-6"
                          onClick={() => handleNavigation(item.route)}
                        >
                          {item.name}
                        </p>
                      )}
                      {index < links.length - 1 && (
                        <div className="w-1/2 h-px bg-gray-200 dark:bg-slate-800 mx-auto"></div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="px-6 py-6 bg-gray-50 dark:bg-slate-800">
                  {user ? (
                    <Button
                      className="w-full text-xl py-4 bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-white"
                      onClick={handleAuthAction}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="w-full mb-4 bg-white dark:bg-slate-900 text-primary dark:text-primary border-2 border-primary dark:border-primary hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors duration-200 text-xl py-4"
                        onClick={() => router.push("/sign-up")}
                      >
                        Sign in
                      </Button>
                      <Button
                        className="w-full text-xl py-4 bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-white"
                        onClick={() => router.push("/sign-up")}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
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
