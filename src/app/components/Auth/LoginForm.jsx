import React, { useState } from "react";
import { login } from "../../../services/authService";

export default function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý đăng nhập - copy nguyên từ AuthForm gốc
  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      console.log({ email, password });
      const result = await login({ email, password });
      console.log("Login success:", result);

      // Redirect về home (Header sẽ tự động cập nhật nhờ auth event)
      window.location.href = "/";
    } catch (error) {
      console.log("Backend error:", error.response?.data);
      let msg = "Invalid email or password";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          msg = error.response.data;
        } else if (typeof error.response.data.message === "string") {
          msg = error.response.data.message;
        } else {
          msg = JSON.stringify(error.response.data);
        }
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-indigo-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-3"
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
            <h2 className="text-lg font-bold text-black mb-1">Welcome Back</h2>
            <p className="text-black/90 text-sm">
              Continue your reading journey
            </p>
          </div>

          <form className="px-6 py-5" onSubmit={handleLogin}>
            <div className="space-y-3">
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
                    className="w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
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
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center pt-3">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </span>
            <button
              onClick={onSwitchToRegister}
              className="font-medium transition-colors hover:underline text-sm text-bg-amber-50 hover:text-indigo-700"
            >
              Register
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
