import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = true,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'rounded-base bg-white dark:bg-dark-bg-secondary p-4 md:p-6 transition-all duration-300 ease-in-out';

    const variantClasses = {
      default: 'shadow-sm',
      elevated: 'shadow-lg',
      outlined: 'border border-gray-200 dark:border-dark-bg-tertiary',
    };

    const hoverClasses = hover ? 'hover:shadow-lg hover:scale-102 dark:hover:shadow-xl' : '';

    const finalClassName = [
      baseClasses,
      variantClasses[variant],
      hoverClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={finalClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
