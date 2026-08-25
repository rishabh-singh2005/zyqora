import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [20.5937, 78.9629]; // center of India

// ==================== CLICK HANDLER (inside MapContainer) ====================
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AddressMap({ lat, lon, label, onMapClick }) {
  const center = lat && lon ? [lat, lon] : DEFAULT_CENTER;
  const zoom = lat && lon ? 15 : 5;

  return (
    <div className="h-56 rounded-lg overflow-hidden border border-primary-100">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {lat && lon && <Marker position={[lat, lon]} icon={defaultIcon} />}
        <ClickHandler onMapClick={onMapClick} />
      </MapContainer>
      <p className="text-xs font-body text-muted mt-1.5 px-1">
        {lat && lon ? label : "Click anywhere on the map to pin your exact location"}
      </p>
    </div>
  );
}