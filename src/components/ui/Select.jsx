import { useState, useRef, useEffect } from "react";

const Select = ({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    const event = {
      target: {
        id: id,
        value: option.value,
      },
    };
    onChange(event);
    setIsOpen(false);
  };

  return (
    <div
      className={`input-group ${isOpen ? "focused" : ""} ${error ? "has-error" : ""}`}
      ref={wrapperRef}
    >
      {label && (
        <label htmlFor={id} className={`input-label ${isOpen ? "active" : ""}`}>
          {label}
        </label>
      )}

      <div className="select-wrapper">
        <div
          className={`input-field select-trigger ${error ? "error" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          tabIndex={0}
        >
          <span className={!selectedOption ? "placeholder-text" : ""}>
            {selectedOption
              ? selectedOption.label
              : placeholder || "Wybierz..."}
          </span>
          <div className={`select-arrow ${isOpen ? "open" : ""}`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div
            className="select-options-list"
            id={`${id}-listbox`}
            role="listbox"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`select-option ${value === option.value ? "selected" : ""}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="input-error-message">
          {Array.isArray(error) ? error[0] : error}
        </div>
      )}
    </div>
  );
};

export default Select;
