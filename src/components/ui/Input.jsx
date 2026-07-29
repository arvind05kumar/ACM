import React, { useId } from 'react';

/**
 * Premium rounded Input component with focus ring, accessible descriptions, and inline validation labels.
 */
export function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  error,
  required = false,
  className = '',
  disabled = false,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-heading font-semibold text-gray-400 uppercase tracking-wider pl-1"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input Box */}
      <div className="relative">
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-3 bg-gray-950/40 border rounded-xl text-gray-200 font-sans text-sm tracking-wide transition-all duration-300
            placeholder:text-gray-500 focus:outline-none focus:bg-gray-900/80
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-900/40' : ''}
            ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : 'border-gray-800 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/20'
            }`}
          {...props}
        />
      </div>

      {/* Inline Validation Error */}
      {error && (
        <span
          id={errorId}
          className="text-xs text-red-500 font-semibold pl-1 transition-all duration-300"
        >
          {error}
        </span>
      )}
    </div>
  );
}
