// src/app/layouts/LoginLayout.jsx
import React from "react";

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-indigo-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-3">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
