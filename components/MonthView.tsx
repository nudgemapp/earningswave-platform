import React from "react";

interface MonthViewProps {
  currentDate: Date;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: Date[] = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(new Date(year, month, -firstDayOfMonth + i + 1));
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Add padding days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="grid grid-cols-7 gap-px bg-gray-200 flex-grow">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div
            key={index}
            className={`bg-white p-2 text-center flex flex-col ${
              date.getMonth() !== currentDate.getMonth()
                ? "text-gray-400"
                : "text-gray-800"
            } ${
              date.toDateString() === new Date().toDateString()
                ? "bg-blue-100"
                : ""
            }`}
          >
            <span className="text-sm">{date.getDate()}</span>
            <div className="flex-grow">
              {/* Add your events or earnings data here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
