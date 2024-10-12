const WeekView = ({
  weekDays,
  weekDates,
}: {
  weekDays: string[];
  weekDates: Date[];
}) => {
  return (
    <div className="flex-1 flex">
      {weekDays.map((day, index) => (
        <div key={day} className="flex-1 flex flex-col relative">
          {index < weekDays.length - 1 && (
            <div className="absolute right-0 top-4 bottom-4 w-px bg-gray-300" />
          )}
          <div className="p-2 text-center bg-gray-100 relative">
            <h2 className="text-lg font-semibold">{day}</h2>
            <p className="text-sm text-gray-600">
              {weekDates[index].toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gray-300" />
          </div>
          <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
            <div className="flex-1 p-2">{/* Add earnings events here */}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekView;
