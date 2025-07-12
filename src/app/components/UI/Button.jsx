import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const baseClasses =
    "font-medium rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
