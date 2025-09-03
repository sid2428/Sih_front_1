import React from 'react';

interface ThemeToggleProps {
  onToggle: () => void;
}

export default function ThemeToggle({ onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="group relative px-4 py-2 rounded-xl bg-white/20 text-white font-medium shadow-md transition-all duration-300 ease-in-out hover:bg-white/30"
    >
      {/* This text can be dynamically changed based on the theme state in the parent component */}
      Toggle Theme
      <span className="absolute inset-0 bg-white/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </button>
  );
}
