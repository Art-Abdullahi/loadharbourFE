import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { debug } from '../../utils/debug';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'text' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loadingText?: string;
  active?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-3.5 text-xl',
} as const;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/95 focus:ring-primary/50',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/95 focus:ring-secondary/50',
  accent: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/95 focus:ring-accent/50',
  text: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-200',
  danger: 'bg-error text-white hover:bg-error/90 active:bg-error/95 focus:ring-error/50',
  success: 'bg-success text-white hover:bg-success/90 active:bg-success/95 focus:ring-success/50',
} as const;

const LoadingSpinner = memo(() => (
  <svg
    className="animate-spin h-4 w-4"
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
));

LoadingSpinner.displayName = 'LoadingSpinner';

export const Button = memo<ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  loadingText,
  active = false,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  debug.render('Button', { variant, size, loading, disabled });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(event);
  };

  const content = (
    <>
      {loading && (
        <>
          <LoadingSpinner />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        touch-manipulation
        disabled:opacity-50 disabled:cursor-not-allowed
        min-h-[2.5rem] sm:min-h-0
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${active ? 'ring-2 ring-offset-2' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';