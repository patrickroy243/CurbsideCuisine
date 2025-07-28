import React from 'react'

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                   bg-white text-gray-700"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
}