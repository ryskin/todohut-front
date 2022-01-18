import { useCallback, useState } from "react";
import ru from "date-fns/locale/ru";
import en from "date-fns/locale/en-US";
import { format, getDay, getDaysInMonth, getWeeksInMonth } from "date-fns";
import { getWeekDays, isDatesEqual } from "../../utils/basic";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const getMonthArray = (year: number, month: number, locale: Locale) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(firstDayOfMonth);
  const weekStartsOn = locale.options?.weekStartsOn ?? 0;
  const firstDayOfWeek = getDay(firstDayOfMonth) - weekStartsOn;
  const weeksInMonth = getWeeksInMonth(firstDayOfMonth, { locale });
  const monthArray = [];
  for (let i = 0; i < weeksInMonth; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      const day = i * 7 + j - firstDayOfWeek + 1;
      if (day <= 0 || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(new Date(year, month, day));
      }
    }
    monthArray.push(week);
  }
  return monthArray;
};

export const DatePicker = ({
  onChange,
  value,
  locale = en,
}: {
  onChange: (date: Date) => void;
  value: Date;
  locale?: Locale;
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(value || currentDate);

  const nextMonth = () => {
    if (selectedMonth > 10) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
      return;
    }
    setSelectedMonth(selectedMonth + 1);
  };

  const previousMonth = () => {
    if (selectedMonth < 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
      return;
    }
    setSelectedMonth(selectedMonth - 1);
  };

  const monthArray = getMonthArray(selectedYear, selectedMonth, locale) || [];

  const handleDayClick = useCallback(
    (date: Date | null) => () => {
      if (!date) return;
      setSelectedDate(date);
      onChange(date);
    },
    [onChange]
  );

  const getDateStyle = (date: Date | null) => {
    if (isDatesEqual(date, selectedDate))
      return "bg-blue-500 rounded-full text-white";
    if (isDatesEqual(date, new Date())) return "text-blue-600 font-semibold";
  };

  return (
    <div>
      <div className="flex font-semibold justify-between m-2">
        <div onClick={previousMonth}>
          <ChevronLeftIcon className="w-4 h-4" />
        </div>
        <div className="text-sm">
          {format(new Date(selectedYear, selectedMonth), "MMMM yyyy", {})}
        </div>
        <div onClick={nextMonth}>
          <ChevronRightIcon className="w-4 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-7 text-sm">
        {getWeekDays({ locale }).map((dayName) => (
          <div
            key={dayName}
            className="flex items-center justify-center w-6 h-6 font-semibold text-gray-600"
          >
            {dayName}
          </div>
        ))}
        {monthArray.map((week) =>
          week.map((date, i) => (
            <div
              key={`${date?.toString()}${i}`}
              onClick={handleDayClick(date)}
              className={`${getDateStyle(
                date
              )} cursor-pointer flex items-center justify-center w-6 h-6 text-xs `}
            >
              {date?.getDate()}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
