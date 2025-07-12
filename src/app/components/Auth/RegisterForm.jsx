import React, { useState } from "react";
import { register } from "../../../services/authService";

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý đăng ký
  async function handleRegister(e) {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Validation tất cả fields required
    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Validation password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validation password length
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Validation username length (backend StringLength(50))
    if (username.length > 50) {
      setErrorMessage("Username must be less than 50 characters");
      setIsLoading(false);
      return;
    }

    // Validation name lengths (backend StringLength(50))
    if (firstName.length > 50) {
      setErrorMessage("First name must be less than 50 characters");
      setIsLoading(false);
      return;
    }

    if (lastName.length > 50) {
      setErrorMessage("Last name must be less than 50 characters");
      setIsLoading(false);
      return;
    }

    try {
      const registerData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      console.log("Register attempt with data:", registerData);

      const result = await register(registerData);

      console.log("Register success:", result);

      // Thông báo thành công cho parent component
      if (onRegisterSuccess) {
        onRegisterSuccess("Account created successfully! Please login.");
      }

      // Chuyển về login form
      onSwitchToLogin();
    } catch (error) {
      console.error("Register error:", error);
      console.error("Error response data:", error.response?.data);

      // Extract error message properly
      let errorMessage = "Registration failed";

      if (error.response?.data) {
        // Backend trả về validation errors
        if (
          typeof error.response.data === "object" &&
          error.response.data.errors
        ) {
          // Nếu có errors object
          const firstError = Object.values(error.response.data.errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (typeof error.response.data === "object") {
          // Nếu data là object nhưng không có errors property (validation errors trực tiếp)
          const errorFields = Object.keys(error.response.data);
          if (errorFields.length > 0) {
            const firstField = errorFields[0];
            const fieldError = error.response.data[firstField];
            errorMessage = `${firstField}: ${
              Array.isArray(fieldError) ? fieldError[0] : fieldError
            }`;
          }
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-3"
      style={{ isolation: "isolate" }}
    >
      <div className="w-full max-w-md">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 text-xs">{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-6 text-center bg-gradient-to-r from-amber-100 to-amber-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
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
            </div>
            <h2 className="text-lg font-bold text-black mb-1">
              Create Account
            </h2>
            <p className="text-black/90 text-sm">
              Start your reading adventure
            </p>
          </div>

          <form className="px-6 py-5" onSubmit={handleRegister}>
            <div className="space-y-3">
              {/* Username Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* First Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              {/* Last Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Last Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-black font-medium rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center justify-center bg-amber-50 text-gray-800 hover:bg-amber-100 focus:ring-amber-200 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="text-center pt-3 pb-6">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <button
              onClick={onSwitchToLogin}
              className="font-medium transition-colors hover:underline text-sm text-indigo-600 hover:text-indigo-700"
            >
              Login
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Discover your next favorite book with{" "}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
              BookNest
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
