import React, { memo } from 'react';
import { debug } from '../../utils/debug';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'unstyled';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  hideLabel?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-2.5 text-lg',
} as const;

const variantClasses: Record<InputVariant, string> = {
  outline: 'border border-gray-300 bg-white focus:border-primary/50',
  filled: 'border-0 bg-gray-100 focus:bg-gray-50',
  unstyled: 'border-0 bg-transparent p-0 focus:ring-0',
} as const;

const InputContainer = memo<{
  className?: string;
  children: React.ReactNode;
}>(({ className = '', children }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
));

InputContainer.displayName = 'InputContainer';

const InputLabel = memo<{
  label: string;
  htmlFor?: string;
  isRequired?: boolean;
  hideLabel?: boolean;
  className?: string;
}>(({ label, htmlFor, isRequired, hideLabel, className = '' }) => {
  if (hideLabel) {
    return <span className="sr-only">{label}</span>;
  }

  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {label}
      {isRequired && <span className="text-error ml-1">*</span>}
    </label>
  );
});

InputLabel.displayName = 'InputLabel';

const InputError = memo<{
  error?: string;
  className?: string;
}>(({ error, className = '' }) => {
  if (!error) return null;

  return (
    <p className={`mt-1.5 text-sm text-error ${className}`}>
      {error}
    </p>
  );
});

InputError.displayName = 'InputError';

const InputHelper = memo<{
  text?: string;
  className?: string;
}>(({ text, className = '' }) => {
  if (!text) return null;

  return (
    <p className={`mt-1.5 text-sm text-gray-500 ${className}`}>
      {text}
    </p>
  );
});

InputHelper.displayName = 'InputHelper';

export const Input = memo(React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'outline',
  leftIcon,
  rightIcon,
  isRequired = false,
  hideLabel = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  containerClassName = '',
  errorClassName = '',
  helperClassName = '',
  id,
  disabled,
  ...props
}, ref) => {
  debug.render('Input', { label, error, disabled });

  return (
    <InputContainer className={containerClassName}>
      {label && (
        <InputLabel
          label={label}
          htmlFor={id}
          isRequired={isRequired}
          hideLabel={hideLabel}
          className={labelClassName}
        />
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`
            w-full rounded-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error focus:border-error' : ''}
            ${className}
            ${inputClassName}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      <InputError error={error} className={errorClassName} />
      <InputHelper text={helperText} className={helperClassName} />
    </InputContainer>
  );
}));

Input.displayName = 'Input';