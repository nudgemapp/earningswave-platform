"use client";

import { useState } from 'react';

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: number;
}

const Tabs: React.FC<TabsProps> = ({ items, defaultActiveTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 justify-evenly">
        {items.map((item, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === index
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary/50'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {items[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
