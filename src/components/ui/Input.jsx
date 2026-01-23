import { useState } from "react";

const Input = ({ label, type = "text", id, placeholder, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`input-group ${isFocused ? "focused" : ""} ${error ? "has-error" : ""}`}
    >
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input
          id={id}
          type={type}
          className={`input-field ${error ? "error" : ""}`}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <div className="input-error-message">
          {Array.isArray(error) ? error[0] : error}
        </div>
      )}
    </div>
  );
};

export default Input;
