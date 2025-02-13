import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../utils/date";

type Props = {
  selectedDate: any;
  setSelectedDate: (value: any) => void;
};

const Date = React.memo(({ selectedDate, setSelectedDate }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized function to toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Memoized function to set selected date
  const handleDateChange = useCallback(
    (date: any) => {
      setSelectedDate(formatDate(date));
      setIsOpen(false); // Close dropdown after selection
    },
    [setSelectedDate]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none">
        Date ▼
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            className="border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
});

export default Date;
