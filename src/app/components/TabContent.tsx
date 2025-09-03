"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { PlotlyProps, ArgoFloat, ChatMessage } from "@/app/types";

// Dynamic import for Plotly.js
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as React.ComponentType<PlotlyProps>;

if (typeof window !== "undefined") {
  delete (L.Icon.Default as any).prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
    iconUrl: require("leaflet/dist/images/marker-icon.png").default,
    shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
  });
}

// Mock Data
const mockFloats: ArgoFloat[] = [
  { id: 1, lat: 0.5, lon: 20.5 },
  { id: 2, lat: 5.2, lon: 40.1 },
  { id: 3, lat: -10.3, lon: 80.4 },
];

const mockSalinityProfile = {
  x: [34.4, 35.0, 35.6, 35.8, 36.0],
  y: [0, 50, 200, 500, 1000],
};

const mockCompareDataA = { x: [0, 100, 200], y: [10, 20, 15] };
const mockCompareDataB = { x: [0, 100, 200], y: [12, 18, 17] };

type Tab = "chat" | "visualize" | "compare" | "insights" | "about";

interface TabContentProps {
  activeTab: Tab;
  theme: "light" | "dark";
}

export default function TabContent({ activeTab, theme }: TabContentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, who: "system", text: "Ask about floats, e.g., show salinity near equator in March 2023" },
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), who: "user", text: currentMessage.trim() }]);
    setCurrentMessage("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, who: "ai", text: `Mock result for: "${currentMessage.trim()}" — generated plot on right.` },
      ]);
    }, 800);
  };

  switch (activeTab) {
    case "chat":
      return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl transition-all duration-300 ease-in-out h-[600px]">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-4">Chat with ARGO AI</h2>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={`p-3 rounded-2xl shadow-sm max-w-[85%] transition-all duration-300 ease-in-out ${m.who === "user" ? "bg-primary-light text-white ml-auto" : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 mr-auto"}`}>
                  <strong className="block text-xs font-medium">{m.who.toUpperCase()}</strong>
                  <p className="mt-1 text-sm">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <input
                className="flex-1 p-3 rounded-2xl border border-gray-300 dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-primary-light outline-none transition-colors duration-200"
                placeholder='Try: "show salinity near equator in March 2023"'
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105 active:scale-95 duration-200"
              >
                Send
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center h-[600px]">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-4">Mock Salinity Profile</h3>
            <div className="w-full flex-1">
              <Plot
                data={[
                  {
                    x: mockSalinityProfile.x,
                    y: mockSalinityProfile.y,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { size: 8, color: '#3b82f6' },
                    line: { width: 3, color: '#2563eb' },
                    name: "Salinity (PSU)",
                  },
                ]}
                layout={{
                  title: {
                    text: "Salinity vs Depth (Mock Data)",
                    font: { size: 18, color: theme === "dark" ? "#f8fafc" : "#0f172a" },
                  },
                  yaxis: {
                    autorange: "reversed",
                    title: "Depth (m)",
                    gridcolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    zerolinecolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    linecolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    tickfont: { color: theme === "dark" ? "#f8fafc" : "#0f172a" },
                    titlefont: { color: theme === "dark" ? "#f8fafc" : "#0f172a" },
                  },
                  xaxis: {
                    title: "Salinity (PSU)",
                    gridcolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    zerolinecolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    linecolor: theme === "dark" ? "#475569" : "#e2e8f0",
                    tickfont: { color: theme === "dark" ? "#f8fafc" : "#0f172a" },
                    titlefont: { color: theme === "dark" ? "#f8fafc" : "#0f172a" },
                  },
                  paper_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff",
                  plot_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff",
                  margin: { t: 50, l: 60, r: 40, b: 60 },
                  autosize: true,
                  showlegend: false,
                }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler
              />
            </div>
          </div>
        </section>
      );
    case "visualize":
      return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col space-y-4">
            <h3 className="text-xl font-semibold mb-2">Filters</h3>
            <label className="block text-sm font-medium">Start Date</label>
            <input type="date" className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-700 outline-none" />
            <label className="block text-sm font-medium">End Date</label>
            <input type="date" className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-700 outline-none" />
            <label className="block text-sm font-medium">Depth (dbar)</label>
            <input type="range" min={0} max={2000} defaultValue={500} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700" />
            <button className="mt-auto w-full py-3 bg-primary text-white font-semibold rounded-2xl shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105 active:scale-95 duration-200">
              Apply Filters
            </button>
          </aside>
          <div className="col-span-1 md:col-span-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-xl flex flex-col min-h-[600px] max-h-[80vh] overflow-hidden">
            <h3 className="text-xl font-semibold px-4 py-2">World Map - Mock Floats</h3>
            <div className="h-full w-full rounded-2xl overflow-hidden">
              <MapContainer center={[0, 20]} zoom={2} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mockFloats.map(f => (
                  <Marker key={f.id} position={[f.lat, f.lon]}>
                    <Popup>
                      <div className="font-sans">
                        <h4 className="font-bold">Float #{f.id}</h4>
                        <p>Latitude: {f.lat}°</p>
                        <p>Longitude: {f.lon}°</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      );
    case "compare":
      return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Float A Profile (Mock)</h3>
            <div className="w-full flex-1 h-[400px]">
              <Plot
                data={[
                  { x: mockCompareDataA.x, y: mockCompareDataA.y, type: "scatter", mode: "lines+markers", name: "Float A", marker: { color: '#f97316' }, line: { color: '#ea580c' } },
                ]}
                layout={{ title: "Float A", autosize: true, paper_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff", plot_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff" }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler
              />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Float B Profile (Mock)</h3>
            <div className="w-full flex-1 h-[400px]">
              <Plot
                data={[
                  { x: mockCompareDataB.x, y: mockCompareDataB.y, type: "scatter", mode: "lines+markers", name: "Float B", marker: { color: '#22c55e' }, line: { color: '#16a34a' } },
                ]}
                layout={{ title: "Float B", autosize: true, paper_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff", plot_bgcolor: theme === "dark" ? "#1f2937" : "#ffffff" }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler
              />
            </div>
          </div>
        </section>
      );
    case "insights":
      return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl flex flex-col transition-all duration-300 ease-in-out hover:scale-105">
              <h4 className="text-lg font-semibold">Insight Card #{i}</h4>
              <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
                Mock insight: unusual low oxygen in Arabian Sea in March 2023.
              </p>
              <div className="mt-4">
                <button className="px-5 py-2 bg-primary text-white rounded-xl shadow-md hover:bg-primary-dark transition-all duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>
      );
    case "about":
      return (
        <section>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">About ARGO Explorer</h2>
            <p className="text-base text-gray-700 dark:text-slate-300 leading-relaxed">
              This is a demo frontend for a data exploration tool. The application showcases mock ARGO float data using interactive Plotly charts and Leaflet maps. The frontend is built using Next.js and styled with Tailwind CSS, leveraging the Geist font family for a modern, polished look. Future development would involve replacing the mock data with live backend API calls to connect with a real database and advanced RAG pipelines.
            </p>
          </div>
        </section>
      );
    default:
      return null;
  }
}
