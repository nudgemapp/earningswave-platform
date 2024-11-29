"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationButton() {
  const [notifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notif) => !notif.read
    ).length;
    setUnreadCount(unreadNotifications);
  }, [notifications]);

  const handleApiClick = async () => {
    try {
      const response = await fetch("/api/finnhub/test-script");
      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error fetching from API:", error);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer"
        >
          <Bell className="w-6 h-6 text-gray-600 dark:text-white hover:text-primary transition-colors duration-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <div className="flex flex-col max-h-[400px] overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-200">
              Notifications
            </h3>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2 bg-white dark:bg-slate-900">
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Add companies to your watchlist to receive updates about:
              </p>
              <ul className="text-xs text-gray-400 dark:text-gray-500 list-disc list-inside text-left">
                <li>Earnings reports</li>
                <li>Earnings call transcripts</li>
                <li>Financial updates</li>
              </ul>
              <Button onClick={handleApiClick}>Sync</Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
