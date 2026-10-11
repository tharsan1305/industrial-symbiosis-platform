import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Info } from 'lucide-react';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    district: string;
    addressHint: string;
  }) => void;
}

const TN_CLUSTERS = [
  { name: 'Chennai - Ennore Industrial Belt', district: 'Chennai', lat: 13.208, lng: 80.3235, desc: 'Thermal Power & Chemicals' },
  { name: 'Erode - Cauvery Sugar & Textile', district: 'Erode', lat: 11.341, lng: 77.7172, desc: 'Sugar Mills & Agro By-products' },
  { name: 'Ariyalur - Cement & Mineral Cluster', district: 'Ariyalur', lat: 11.1401, lng: 79.0786, desc: 'Cement Kilns & Pozzolana' },
  { name: 'Tiruchirappalli - Bio-Energy & Allied', district: 'Tiruchirappalli', lat: 10.825, lng: 78.718, desc: 'Distilleries & Heavy Eng' },
  { name: 'Thanjavur - Cauvery Delta Agro Hub', district: 'Thanjavur', lat: 10.787, lng: 79.1378, desc: 'Paddy Rice Mills & Biomass' },
  { name: 'Coimbatore - Engineering & Foundry', district: 'Coimbatore', lat: 11.0168, lng: 76.9558, desc: 'Foundry Sand & Metal Slag' },
  { name: 'Salem - Steel & Magnesite', district: 'Salem', lat: 11.6643, lng: 78.146, desc: 'Slag & Mineral Tailings' },
  { name: 'Tuticorin (Thoothukudi) - Port & Thermal', district: 'Thoothukudi', lat: 8.7642, lng: 78.1348, desc: 'Fly Ash & Phosphogypsum' },
];

export const MapPicker: React.FC<MapPickerProps> = ({
  initialLat = 10.825,
  initialLng = 78.718,
  onLocationSelect,
}) => {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [selectedCluster, setSelectedCluster] = useState<string>('Tiruchirappalli - Bio-Energy & Allied');

  const handleClusterClick = (cluster: typeof TN_CLUSTERS[0]) => {
    setLat(cluster.lat);
    setLng(cluster.lng);
    setSelectedCluster(cluster.name);
    onLocationSelect({
      latitude: cluster.lat,
      longitude: cluster.lng,
      district: cluster.district,
      addressHint: cluster.name,
    });
  };

  const handleManualMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Map relative X/Y to Tamil Nadu bounds approximately
    // TN Bounding box: Lat 8.0 to 13.5, Lng 76.2 to 80.4
    const newLng = +(76.2 + (x / rect.width) * (80.4 - 76.2)).toFixed(4);
    const newLat = +(13.5 - (y / rect.height) * (13.5 - 8.0)).toFixed(4);

    setLat(newLat);
    setLng(newLng);
    setSelectedCluster('Custom Map Coordinate');
    onLocationSelect({
      latitude: newLat,
      longitude: newLng,
      district: 'Tamil Nadu Region',
      addressHint: `GPS Pin: ${newLat}° N, ${newLng}° E`,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-bold text-stone-900 dark:text-white block">
          Industrial Facility Geo-Coordinates
        </label>
        <p className="text-xs text-stone-500">
          Click on the interactive map or choose a verified Tamil Nadu industrial zone to compute freight radius and symbiosis distance.
        </p>
      </div>

      {/* Preset industrial clusters */}
      <div className="flex flex-wrap gap-2">
        {TN_CLUSTERS.map((cluster) => (
          <button
            key={cluster.name}
            type="button"
            onClick={() => handleClusterClick(cluster)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition text-left ${
              selectedCluster === cluster.name
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
            }`}
          >
            <span className="block font-bold">{cluster.district}</span>
            <span className="text-[10px] opacity-80">{cluster.desc}</span>
          </button>
        ))}
      </div>

      {/* Visual map canvas */}
      <div
        onClick={handleManualMapClick}
        className="relative h-64 bg-slate-900 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 cursor-crosshair shadow-inner"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 45%, #0f172a 100%)',
        }}
      >
        {/* Geographic grid lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
               backgroundSize: '32px 32px'
             }}
        />

        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs px-3 py-1.5 rounded-md text-white text-xs border border-stone-700 flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tamil Nadu Industrial Symbiosis Corridor</span>
        </div>

        {/* Existing clusters rendered as reference points */}
        {TN_CLUSTERS.map((c) => {
          // Normalize lat (8.0 - 13.5) and lng (76.2 - 80.4) to percentage
          const topPercent = ((13.5 - c.lat) / (13.5 - 8.0)) * 100;
          const leftPercent = ((c.lng - 76.2) / (80.4 - 76.2)) * 100;
          const isSelected = selectedCluster === c.name;

          return (
            <div
              key={c.name}
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isSelected ? 'bg-amber-400 ring-4 ring-amber-400/30 animate-pulse' : 'bg-emerald-400/80'
                }`}
              />
              <span className="text-[10px] text-white/90 whitespace-nowrap ml-2 font-mono drop-shadow">
                {c.district}
              </span>
            </div>
          );
        })}

        {/* Active selected pin */}
        <div
          style={{
            top: `${((13.5 - lat) / (13.5 - 8.0)) * 100}%`,
            left: `${((lng - 76.2) / (80.4 - 76.2)) * 100}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
        >
          <div className="flex flex-col items-center">
            <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow">
              Facility Pin
            </span>
            <MapPin className="w-6 h-6 text-amber-400 fill-amber-500 drop-shadow-md" />
          </div>
        </div>

        <div className="absolute bottom-2 right-2 text-[10px] text-emerald-300/80 bg-stone-900/80 px-2 py-1 rounded">
          Click anywhere to pin exact factory gate
        </div>
      </div>

      {/* Lat/Long Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={lat}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              setLat(val);
              onLocationSelect({ latitude: val, longitude: lng, district: 'Custom', addressHint: `${val}, ${lng}` });
            }}
            className="w-full mt-1 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-mono text-stone-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={lng}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              setLng(val);
              onLocationSelect({ latitude: lat, longitude: val, district: 'Custom', addressHint: `${lat}, ${val}` });
            }}
            className="w-full mt-1 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-mono text-stone-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
