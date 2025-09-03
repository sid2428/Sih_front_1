"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArgoFloat } from "@/app/types";

interface MapComponentProps {
  floats: ArgoFloat[];
}

// This is the crucial fix for Leaflet icons
// The code below ensures the icon paths are correctly resolved on the client side.
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const center: [number, number] = [0, 20];
const zoom = 2;

export default function MapComponent({ floats }: MapComponentProps) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {floats.map(f => (
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
  );
}
