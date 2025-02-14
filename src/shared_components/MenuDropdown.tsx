import React, { useState, useRef, useEffect, useCallback } from "react";
import { DropdownProps } from "../types";

const Dropdown: React.FC<DropdownProps> = React.memo(
  ({ label, options, selectedValue, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    // Toggle dropdown state
    const toggleDropdown = useCallback(() => {
      setIsOpen((prev) => !prev);
    }, []);

    const handleSelect = useCallback(
      (value: string) => {
        onChange(value);
        setIsOpen(false);
      },
      [onChange]
    );

    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button className="focus:outline-none" onClick={toggleDropdown}>
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : label}{" "}
          ▼
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-lg">
            {options &&
              options?.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
);

export default Dropdown;
