import React from 'react';
import { GeistSans } from 'geist/font';
import ThemeToggle from './ThemeToggle';

type Tab = "chat" | "visualize" | "compare" | "insights" | "about";

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onThemeToggle: () => void;
}

const tabs: { key: Tab; label: string }[] = [
  { key: "chat", label: "Chat" },
  { key: "visualize", label: "Visualize" },
  { key: "compare", label: "Compare" },
  { key: "insights", label: "Insights" },
  { key: "about", label: "About" },
];

export default function Header({ activeTab, setActiveTab, onThemeToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 w-12 h-12 flex items-center justify-center text-xl shadow-inner">🌊</div>
        <h1 className={`text-2xl font-semibold tracking-wide ${GeistSans.className}`}>ARGO Explorer</h1>
      </div>

      <nav className="hidden md:flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative text-lg transition-colors duration-200 after:absolute after:bottom-[-8px] after:left-1/2 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 ${activeTab === tab.key ? "after:w-full after:left-0" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
