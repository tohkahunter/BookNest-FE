
import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">BookNest</h1>
        <p className="text-gray-600 mb-6">Welcome to your book management system</p>
        
        <div className="space-y-4">
          <Link
            to="/book/9648068"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200"
          >
            View Sample Book Detail
          </Link>
          
          <Link
            to="/login"
            className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}