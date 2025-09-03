import React from "react";
import Plotly from "plotly.js";
import L from "leaflet";

// Custom type for the Plotly component, ensuring type safety.
export interface PlotlyProps {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  style?: React.CSSProperties;
  useResizeHandler?: boolean;
}

// Defining a type for a single ARGO float data point.
export type ArgoFloat = {
  id: number;
  lat: number;
  lon: number;
};

// Defining a type for a mock chat message.
export type ChatMessage = {
  id: number;
  who: "system" | "user" | "ai";
  text: string;
};

// Defining the available tabs for navigation.
export type Tab = "chat" | "visualize" | "compare" | "insights" | "about";

// Adding types for Leaflet layers, which is a good practice for type safety.
export type LeafletLayer = L.Layer | L.LayerGroup;
