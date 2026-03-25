import { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    onChange(selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]);
  };

  const hasSelected = selected.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
          border transition-all duration-150 cursor-pointer select-none
          ${hasSelected
            ? 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100'
            : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300 hover:bg-surface-50'
          }`}
      >
        <span>{label}</span>
        {hasSelected && (
          <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full
            bg-primary-500 text-white text-[10px] font-bold leading-none">
            {selected.length}
          </span>
        )}
        <svg
          className={`w-3 h-3 transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-surface-200
          rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-surface-50 cursor-pointer
                transition-colors duration-100 text-xs group"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                ${selected.includes(option.value)
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-surface-300 group-hover:border-primary-300'}`}
              >
                {selected.includes(option.value) && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <polyline points="1,4 3,6.5 7,1.5" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              <span className="text-surface-700 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
