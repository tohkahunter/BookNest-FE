import React from "react";

// Main Loading component with spinner
const Loading = ({
  size = "md",
  variant = "spinner",
  text = "",
  className = "",
  fullScreen = false,
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const Spinner = () => (
    <div
      className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
    />
  );

  const Dots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );

  const Pulse = () => (
    <div className={`${sizes[size]} bg-blue-600 rounded-full animate-pulse`} />
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <Dots />;
      case "pulse":
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        {renderLoader()}
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loaders for different content types
export const BookCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    {/* Book cover skeleton */}
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>

    {/* Title skeleton */}
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

    {/* Author skeleton */}
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

    {/* Rating skeleton */}
    <div className="flex items-center space-x-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
      ))}
    </div>

    {/* Button skeleton */}
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

export const AuthorCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse text-center">
    {/* Avatar skeleton */}
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>

    {/* Name skeleton */}
    <div className="h-4 bg-gray-200 rounded mb-2"></div>

    {/* Book count skeleton */}
    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>

    {/* Button skeleton */}
    <div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div>
  </div>
);

export const BookGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, index) => (
      <BookCardSkeleton key={index} />
    ))}
  </div>
);

export const AuthorGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(count)].map((_, index) => (
      <AuthorCardSkeleton key={index} />
    ))}
  </div>
);

// Text content skeleton
export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-gray-200 rounded animate-pulse ${
          index === lines - 1 ? "w-3/4" : "w-full"
        }`}
      ></div>
    ))}
  </div>
);

// List skeleton
export const ListSkeleton = ({ items = 5, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(items)].map((_, index) => (
      <div key={index} className="flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Page skeleton for full page loading
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    {/* Header skeleton */}
    <div className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="flex space-x-4">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    {/* Hero skeleton */}
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-20">
      <div className="container mx-auto text-center space-y-4">
        <div className="h-12 bg-white bg-opacity-20 rounded mx-auto w-96"></div>
        <div className="h-6 bg-white bg-opacity-20 rounded mx-auto w-64"></div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-8 space-y-12">
      <BookGridSkeleton count={8} />
    </div>
  </div>
);

export default Loading;
