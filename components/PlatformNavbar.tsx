"use client";

import Logo from "./Logo";
import { useState } from "react";
import Link from "next/link";
import { ArchiveRestore, Search } from "lucide-react";

const PlatformNavbar = () => {
  const [activeTab, setActiveTab] = useState("Calendar");

  const navItems = ["Calendar", "News", "Alerts", "Quote"];

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex container rounded-lg bg-gray-300 w-full p-2 mx-auto max-w-full ring-1 ring-gray-700/70">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-row items-center">
            <Logo />
            <nav className="flex gap-2 ml-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out
                  ${
                    activeTab === item
                      ? "bg-slate-600 text-white"
                      : "bg-gray-200 text-slate-700 hover:bg-slate-500 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(item)}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-gray-200 text-slate-700 hover:bg-slate-500 hover:text-white transition-all duration-200 ease-in-out">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-200 text-slate-700 hover:bg-slate-500 hover:text-white transition-all duration-200 ease-in-out">
              <ArchiveRestore className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformNavbar;
