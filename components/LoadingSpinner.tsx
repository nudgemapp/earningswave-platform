import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 bg-opacity-50 dark:bg-opacity-50 z-10">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
);

export default LoadingSpinner;
