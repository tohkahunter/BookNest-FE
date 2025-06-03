import React, { useState } from 'react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate authentication functions
  async function handleLogin() {
    setErrorMessage(null);
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      console.log('Login successful');
      alert('Login successful!');
      
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister() {
    setErrorMessage(null);
    setIsLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      console.log('Registration successful');
      alert('Registration successful!');
      
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestLogin() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate guest login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Guest login successful');
      alert('Guest login successful!');
      
    } catch (error) {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Google login successful');
      alert('Google login successful!');
      
    } catch (error) {
      setErrorMessage('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const switchToRegister = () => {
    setIsLogin(false);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setErrorMessage(null);
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-indigo-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-3" style={{ isolation: 'isolate' }}>
      <div className="w-full max-w-md">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-xs">{errorMessage}</p>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header - Compact */}
          <div className={`px-6 py-6 text-center ${isLogin 
            ? 'bg-gradient-to-r from-amber-100 to-amber-300'

            : 'bg-gradient-to-r from-amber-100 to-amber-300'

          }`}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-black mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-black/90 text-sm">
              {isLogin ? 'Continue your reading journey' : 'Start your reading adventure'}
            </p>
          </div>

          {/* Form Content - Compact */}
          <div className="px-6 py-5">
            <div className="space-y-3">
              {/* Guest Login Button - Only show on login */}
              {isLogin && (
                <button
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-black-700 font-medium rounded-lg border border-gray-200 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    'Login as Guest'
                  )}
                </button>
              )}

              {/* Form Fields in Grid for Register */}
              <div className={!isLogin ? 'space-y-3' : 'space-y-3'}>
                {/* Name field - Only show on register */}
                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                        placeholder="Enter your full name"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white ${
                        isLogin 
                          ? 'focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter your email"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm bg-gray-50 hover:bg-white ${
                        isLogin 
                          ? 'focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'focus:ring-emerald-500 focus:border-emerald-500'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - Only show on register */}
                {!isLogin && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 pl-3 pr-9 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm bg-gray-50 hover:bg-white"
                        placeholder="Confirm your password"
                      />
                      <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Submit Button */}
              <button
                onClick={isLogin ? handleLogin : handleRegister}
                disabled={isLoading}
                className={`w-full py-2.5 px-4 text-black font-medium rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center justify-center ${
                  isLogin 
                    ? 'bg-amber-50 text-gray-800 hover:bg-amber-100 focus:ring-amber-200'
 
                    : 'bg-amber-50 text-gray-800 hover:bg-amber-100 focus:ring-amber-200'

                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Register'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-gray-500 text-xs font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-3 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                ) : (
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
              </button>

              {/* Toggle Auth Mode */}
              <div className="text-center pt-3">
                <span className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={isLogin ? switchToRegister : switchToLogin}
                  className={`font-medium transition-colors hover:underline text-sm ${
                    isLogin 
                      ? 'text-bg-amber-50 hover:text-indigo-700' 
                      : 'text-bg-amber-50 hover:text-indigo-700'
                  }`}
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Discover your next favorite book with{' '}
            <span className={`font-bold bg-clip-text text-transparent ${
              isLogin 
                ? 'bg-gradient-to-r from-amber-200 to-amber-400'

 
                : 'bg-gradient-to-r from-amber-200 to-amber-400'


            }`}>
              goodRead
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}