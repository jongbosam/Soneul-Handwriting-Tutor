import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white border-orange-500 hover:bg-orange-400",
    secondary: "bg-sky-400 text-white border-sky-600 hover:bg-sky-500",
    danger: "bg-red-400 text-white border-red-600 hover:bg-red-500",
    ghost: "bg-transparent text-gray-600 border-transparent shadow-none hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm min-h-[36px]",
    md: "px-6 py-3 text-lg min-h-[50px]",
    lg: "px-8 py-4 text-2xl min-h-[64px] w-full",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};