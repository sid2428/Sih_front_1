"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/**
 * NOTE:
 * - react-plotly.js is loaded dynamically (client-only).
 * - We keep this page as a client component ("use client") because it uses hooks and client-only libs.
 */

// dynamic import Plotly (client-side only)
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as typeof import("react-plotly.js").default;

// Fix leaflet marker icon paths (common issue)
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Page() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<"chat" | "visualize" | "compare" | "insights" | "about">(
    "chat"
  );
  // New state for the researcher/normal mode toggle
  const [isResearcher, setIsResearcher] = useState(false);

  // mock chat messages
  const [messages, setMessages] = useState([
    { id: 1, who: "system", text: "Welcome to ARGO Explorer, your deep ocean data assistant! Ask about floats, e.g., show salinity near the equator in March 2023." },
    { id: 2, who: "user", text: "What's the average temperature in the North Atlantic?" },
    { id: 3, who: "ai", text: "Based on data from ARGO floats, the average sea surface temperature in the North Atlantic in June 2023 was approximately 20°C. For more details, switch to the Visualize tab." },
    { id: 4, who: "user", text: "Can you compare float data from two different locations?" },
    { id: 5, who: "ai", text: "Sure! Use the 'Compare' tab to select two floats and see their data profiles side-by-side. You can analyze temperature, salinity, and pressure differences easily." },
  ]);

  // mock floats
  const mockFloats = [
    { id: 1, lat: 0.5, lon: 20.5 },
    { id: 2, lat: 5.2, lon: 40.1 },
    { id: 3, lat: -10.3, lon: 80.4 },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // sample data for plots (mock)
  const salinityProfile = {
    x: [34.4, 35.0, 35.6, 35.8, 36.0], // salinity PSU
    y: [0, 50, 200, 500, 1000], // depth (m)
  };

  const compareA = { x: [0, 100, 200], y: [10, 20, 15] };
  const compareB = { x: [0, 100, 200], y: [12, 18, 17] };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* NAV */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 w-10 h-10 flex items-center justify-center text-lg">🌊</div>
          <h1 className="text-xl font-semibold">ARGO Explorer</h1>
        </div>

        {/* This is the new navigation with corrected styling */}
        <nav className="hidden md:flex gap-6 relative">
          {(["chat", "visualize", "compare", "insights", "about"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="nav-item group relative font-bold hover:text-white transition-all duration-300 ease-in-out px-4 py-2"
            >
              <span className="relative z-10">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {/* Bubble effect layer */}
              <div
                className={`bubble absolute rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out`}
              ></div>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Researcher/Normal mode toggle button */}
          <div className="flex items-center rounded-full bg-white/20 p-1">
            <button
              onClick={() => setIsResearcher(false)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${!isResearcher ? "bg-white/40 text-white" : ""}`}
            >
              Normal
            </button>
            <button
              onClick={() => setIsResearcher(true)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${isResearcher ? "bg-white/40 text-white" : ""}`}
            >
              Researcher
            </button>
          </div>
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="bg-white/20 px-3 py-1 rounded"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* TABS */}
      <main className="px-4 md:px-12 py-8">
        {/* mobile tab picker */}
        <div className="md:hidden mb-4 flex gap-2">
          {(["chat", "visualize", "compare", "insights", "about"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white/60 dark:bg-slate-700"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* large layout */}
        {activeTab === "chat" && (
          <section className="grid md:grid-cols-2 gap-6 min-h-[calc(100vh-10rem)]">
            {/* Left: Chat */}
            <div className="space-y-4 flex flex-col">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex-1 flex flex-col">
                <h2 className="font-semibold mb-2">Chat with ARGO AI</h2>
                <div className="space-y-2 flex-1 overflow-auto">
                  {messages.map(m => (
                    <div key={m.id} className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                      <strong>{m.who}</strong>: {m.text}
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700"
                    placeholder='Try: "show salinity near equator in March 2023"'
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (!val) return;
                        setMessages(prev => [...prev, { id: Date.now(), who: "user", text: val }]);
                        (e.target as HTMLInputElement).value = "";
                        // mock AI reply
                        setTimeout(() => {
                          setMessages(prev => [
                            ...prev,
                            { id: Date.now() + 1, who: "ai", text: `Mock result for: "${val}" — generated plot on right.` },
                          ]);
                        }, 800);
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
                    onClick={() =>
                      setMessages(prev => [...prev, { id: Date.now(), who: "user", text: "Show mock salinity profile" }])
                    }
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Plot */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-2">Mock Salinity Profile</h3>
              <div style={{ width: "100%", height: 420 }}>
                <Plot
                  data={[
                    {
                      x: salinityProfile.x,
                      y: salinityProfile.y,
                      type: "scatter",
                      mode: "lines+markers",
                      marker: { size: 6, color: 'rgb(29, 137, 230)' },
                      line: { color: 'rgb(29, 137, 230)' },
                      name: "Salinity (PSU)",
                    },
                  ]}
                  layout={{
                    title: "Salinity vs Depth (mock)",
                    yaxis: { autorange: "reversed", title: "Depth (m)" },
                    xaxis: { title: "Salinity (PSU)" },
                    margin: { t: 40, l: 50, r: 30, b: 50 },
                    autosize: true,
                    paper_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff",
                    plot_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff",
                    font: {
                      color: theme === "dark" ? "#e2e8f0" : "#1e293b"
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                  useResizeHandler
                />
              </div>
            </div>
          </section>
        )}

        {activeTab === "visualize" && (
          <section className="grid md:grid-cols-4 gap-4">
            <aside className="col-span-1 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg space-y-3">
              <h3 className="font-semibold">Filters</h3>
              <label className="block text-sm">Start date</label>
              <input type="date" className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
              <label className="block text-sm">End date</label>
              <input type="date" className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
              <label className="block text-sm">Depth (dbar)</label>
              <input type="range" min={0} max={2000} defaultValue={500} className="w-full" />
              <button className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg shadow-md">Apply</button>
            </aside>

            <div className="col-span-3 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg h-[520px]">
              <h3 className="font-semibold px-3 py-2">World Map — Mock Floats</h3>
              <div className="h-[460px] rounded-lg overflow-hidden">
                <MapContainer center={[0, 20]} zoom={2} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {mockFloats.map(f => (
                    <Marker key={f.id} position={[f.lat, f.lon]}>
                      <Popup>
                        Float #{f.id} <br />
                        Lat: {f.lat} Lon: {f.lon}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </section>
        )}

        {activeTab === "compare" && (
          <section className="mt-4 grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-2">Float A Profile (mock)</h3>
              <Plot
                data={[
                  { x: compareA.x, y: compareA.y, type: "scatter", mode: "lines+markers", name: "Float A", marker: { color: 'rgb(29, 137, 230)' }, line: { color: 'rgb(29, 137, 230)' } },
                ]}
                layout={{ title: "Float A", paper_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff", plot_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff", font: { color: theme === "dark" ? "#e2e8f0" : "#1e293b" } }}
                style={{ width: "100%", height: 320 }}
                useResizeHandler
              />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-2">Float B Profile (mock)</h3>
              <Plot
                data={[
                  { x: compareB.x, y: compareB.y, type: "scatter", mode: "lines+markers", name: "Float B", marker: { color: 'rgb(41, 192, 198)' }, line: { color: 'rgb(41, 192, 198)' } },
                ]}
                layout={{ title: "Float B", paper_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff", plot_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff", font: { color: theme === "dark" ? "#e2e8f0" : "#1e293b" } }}
                style={{ width: "100%", height: 320 }}
                useResizeHandler
              />
            </div>
          </section>
        )}

        {activeTab === "insights" && (
          <section className="mt-4 grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg">
                <h4 className="font-semibold">Insight card #{i}</h4>
                <p className="text-sm mt-2">Mock insight: unusual low oxygen in Arabian Sea in March 2023.</p>
                <div className="mt-3">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md">View details</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "about" && (
          <section className="mt-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold">About ARGO Explorer (Mock)</h2>
              <p className="mt-2 text-sm">
                This is a demo frontend using mock ARGO float data, Plotly charts and Leaflet maps. Replace mocks with backend APIs
                later to connect to Postgres / RAG pipelines.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-4 px-6 bg-slate-100 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex justify-between">
          <span>Powered by ARGO • Mock demo</span>
          <span>Privacy • Terms • API Docs</span>
        </div>
      </footer>
    </div>
  );
}