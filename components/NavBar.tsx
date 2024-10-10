"use client";

import { useState, useEffect } from "react";
import { MenuIcon, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import Logo from "./Logo";

// Custom hook for mount animation
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
      route: "/calendar",
      name: "Calendar",
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
          className="md:sticky md:top-0 md:shadow-none z-20 mt-[5rem] md:mt-0"
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
                    Start for free
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* MOBILE */}
          <div
            className={`block lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white py-4 animate-in fade-in zoom-in  ${
              menu ? " bg-primary py-2" : ""
            } `}
          >
            <div className="flex justify-between mx-[10px]">
              <div className="flex gap-[50px] text-[16px] items-center select-none">
                <Logo />
              </div>
              <div className="flex items-center gap-[40px]">
                {menu ? (
                  <X
                    className="cursor-pointer animate-in fade-in zoom-in text-black"
                    onClick={toggleMenu}
                  />
                ) : (
                  <MenuIcon />
                )}
              </div>
            </div>
            {menu ? (
              <div className="my-8 select-none animate-in slide-in-from-right">
                <div className="flex flex-col gap-8 mt-8 mx-4">
                  {links.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      {item.dropdownItems ? (
                        <>
                          <p className="font-[500] text-gray">{item.name}</p>
                          <div className="ml-4 flex flex-col gap-2">
                            {item.dropdownItems.map(
                              (dropdownItem, dropdownIndex) => (
                                <p
                                  key={dropdownIndex}
                                  className="hover:text-primary cursor-pointer text-gray transition-colors duration-200"
                                  onClick={() =>
                                    handleNavigation(dropdownItem.route)
                                  }
                                >
                                  {dropdownItem.name}
                                </p>
                              )
                            )}
                          </div>
                        </>
                      ) : (
                        <p
                          className={`hover:text-primary cursor-pointer flex items-center gap-2 font-[500] text-gray`}
                          onClick={() => handleNavigation(item.route)}
                        >
                          {item.name}
                        </p>
                      )}
                      {item.badgeCount ? (
                        <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                          {item.badgeCount}
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col gap-[20px] select-none">
                    <Button className="bg-white text-[#31373D] border-[#EDEEF0] hover:bg-white">
                      Sign in
                    </Button>

                    <Button>Start for free</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NavBar;
