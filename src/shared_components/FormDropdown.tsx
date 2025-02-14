import React from "react";
import { DropdownProps } from "../types";

const Dropdown: React.FC<DropdownProps> = React.memo(
  ({ label, options, selectedValue, onChange, className }) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-gray-200 focus:ring-gray-200"
          value={selectedValue}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select an option</option>
          {options &&
            options?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
        </select>
      </div>
    );
  }
);

export default Dropdown;
