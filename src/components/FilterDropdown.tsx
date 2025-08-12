import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  label = "Sort by"
}) => {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mr-2">
        {label}:
      </label>
      <div className="relative inline-block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg 
                     px-4 py-2 pr-8 text-sm font-medium text-gray-700
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     hover:border-gray-300 transition-colors cursor-pointer
                     shadow-sm"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};