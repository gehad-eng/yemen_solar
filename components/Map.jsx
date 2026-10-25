'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link'; // إضافة استيراد Link

// إصلاح مشكلة أيقونات الخريطة الافتراضية في Next.js
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: iconMarker.src,
    iconRetinaUrl: iconRetina.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ merchants }) {
  // الإحداثيات الافتراضية (وسط اليمن تقريباً)
  const defaultPosition = [15.3694, 44.1910]; 

  return (
    <MapContainer center={defaultPosition} zoom={7} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {merchants.map((merchant) => (
        <Marker key={merchant.id} position={merchant.position}>
          <Popup>
            <div className="text-right font-sans min-w-[200px]" dir="rtl">
              <h3 className="font-bold text-lg text-slate-800 mb-1">{merchant.name}</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full inline-block mb-2">{merchant.type}</span>
              
              <div className="space-y-1 text-sm text-slate-600 mb-3">
                <p>{merchant.address}</p>
                <p dir="ltr" className="font-mono">{merchant.phone}</p>
              </div>

              <Link 
                href={`/merchant/${merchant.id}`} 
                className="block w-full bg-slate-900 text-white text-center py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
              >
                زيارة المتجر
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}