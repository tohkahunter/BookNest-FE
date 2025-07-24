import React from "react";
import { Alert } from "../UI";
import Footer from "../Footer";
import Header from "../Header";

const AuthLayout = ({
  title,
  subtitle,
  children,
  error,
  success,
  onClearError,
  onClearSuccess,
  headerColor = "blue",
  icon,
}) => {
  const colorVariants = {
    blue: "from-blue-100 to-blue-300",
    green: "from-green-100 to-green-300",
    amber: "from-amber-100 to-amber-300",
    purple: "from-purple-100 to-purple-300",
  };

  const defaultIcon = (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-0 m-0"
      style={{ isolation: "isolate" }}
    >
      <div className="w-full max-w-md mx-auto px-4">
        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={onClearError} />
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4">
            <Alert type="success" message={success} onClose={onClearSuccess} />
          </div>
        )}

        {/* Main Card - Children component will handle this */}
        {children}

        {/* Footer */}
      </div>
    </div>
  );
};

export default AuthLayout;
