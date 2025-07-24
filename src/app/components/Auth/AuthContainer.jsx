import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Alert } from "../UI";

const AuthContainer = () => {
  const [currentView, setCurrentView] = useState("login"); // 'login' | 'register'
  const [globalMessage, setGlobalMessage] = useState(null);

  const switchToLogin = () => {
    setCurrentView("login");
    // Keep global message when switching from register to login
  };

  const switchToRegister = () => {
    setCurrentView("register");
    setGlobalMessage(null); // Clear message when switching to register
  };

  const handleRegisterSuccess = (message) => {
    setGlobalMessage({
      type: "success",
      text: message,
    });
  };

  const clearGlobalMessage = () => {
    setGlobalMessage(null);
  };

  return (
    <div className="relative">
      {/* Global Success Message - Floating */}
      {globalMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-3">
          <Alert
            type={globalMessage.type}
            message={globalMessage.text}
            onClose={clearGlobalMessage}
            className="shadow-lg animate-fade-in"
          />
        </div>
      )}

      {/* Render Current View */}
      {currentView === "login" ? (
        <LoginForm onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterForm
          onSwitchToLogin={switchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Add fade-in animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthContainer;
