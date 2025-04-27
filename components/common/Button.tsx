'use client';

import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none
        ${size === 'sm' ? 'px-2.5 py-1.5 text-xs' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'}
        ${variant === 'primary' ? 'bg-primary text-white hover:bg-primary-dark' : ''}
        ${variant === 'secondary' ? 'bg-secondary text-gray-900 hover:bg-secondary-dark' : ''}
        ${variant === 'outline' ? 'border border-primary text-primary hover:bg-primary hover:text-white' : ''}
        ${variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700' : ''}
        ${variant === 'success' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
        ${variant === 'text' ? 'text-primary hover:bg-gray-100' : ''}
        ${isFullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isLoading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;