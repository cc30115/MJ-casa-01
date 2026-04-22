import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LOCATIONS = [
  {
    id: '01',
    name: "TAICHUNG HQ",
    address: "台中市西屯區台灣大道三段266號",
    lat: 24.1630,
    lng: 120.6450,
    isComingSoon: false
  },
  {
    id: '02',
    name: "CIVIC SQUARE BRANCH",
    address: "台中市西區 (Coming soon within 1 year)",
    lat: 24.1500,
    lng: 120.6600,
    isComingSoon: true
  },
  {
    id: '03',
    name: "SEVENTH REDEVELOPMENT ZONE",
    address: "台中市七期重劃區 (Coming soon within 1 year)",
    lat: 24.1580,
    lng: 120.6380,
    isComingSoon: true
  }
];

// Sub-component to handle map flyTo animation when active location changes
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

// Leaflet DivIcon factory
const createCustomIcon = (id: string, isActive: boolean) => {
  const html = `
    <div class="relative w-12 h-12 rounded-full flex items-center justify-center font-serif text-sm transition-colors duration-500 shadow-2xl ${isActive ? 'bg-[#C9A87C] text-[#191514] outline outline-2 outline-offset-2 outline-[#C9A87C]/50' : 'bg-[#292321] border border-white/10 text-white/50 drop-shadow-md'}">
      ${id}
      ${isActive ? '<div class="absolute inset-0 rounded-full border border-[#C9A87C] animate-ping opacity-30 pointer-events-none"></div>' : ''}
    </div>
  `;
  return L.divIcon({
    html,
    className: '', // Prevents default white square
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

export default function OfficeLocations() {
  const [activeLoc, setActiveLoc] = useState(LOCATIONS[0].id);
  const activeLocationData = LOCATIONS.find(loc => loc.id === activeLoc) || LOCATIONS[0];
  const mapCenter: [number, number] = [activeLocationData.lat, activeLocationData.lng];

  // We manually add custom DOM elements as markers since React-Leaflet <Marker> with custom interactive HTML works best this way or via hooks for custom styling.
  function CustomMarkers() {
    const map = useMap();
    
    useEffect(() => {
      // Clear existing markers created manually
      const markers: L.Marker[] = [];
      
      LOCATIONS.forEach(loc => {
        const isActive = activeLoc === loc.id;
        const icon = createCustomIcon(loc.id, isActive);
        
        const marker = L.marker([loc.lat, loc.lng], { 
          icon,
          zIndexOffset: isActive ? 1000 : 0 
        }).addTo(map);

        // Standard DOM event wrapper 
        marker.on('mouseover', () => {
          setActiveLoc(loc.id);
        });

        markers.push(marker);
      });

      return () => {
        markers.forEach(m => map.removeLayer(m));
      };
    }, [map, activeLoc]);

    return null;
  }

  return (
    <section id="locations" className="relative z-content bg-transparent border-t border-white/5 flex flex-col lg:flex-row min-h-[80vh]">
      {/* Left List */}
      <div className="w-full lg:w-[40%] px-6 md:px-[5vw] py-24 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-20 text-mj-accent gs-reveal">
          <span className="font-serif text-xl">04</span>
          <div className="h-[1px] w-12 bg-mj-accent/50"></div>
          <span className="tracking-[0.2em] text-sm uppercase">Locations</span>
        </div>
        
        <ul className="space-y-4 lg:space-y-6 gs-reveal">
          {LOCATIONS.map((loc) => {
            const isActive = activeLoc === loc.id;
            return (
              <li 
                key={loc.id} 
                className={`group flex items-start py-4 cursor-pointer transition-all duration-500 hover-target ${isActive ? 'text-mj-text' : 'text-mj-muted hover:text-white'}`}
                onMouseEnter={() => setActiveLoc(loc.id)}
              >
                <span className={`font-serif text-sm mr-8 mt-[2px] transition-colors ${isActive ? 'text-mj-accent' : 'text-mj-muted group-hover:text-mj-accent'}`}>
                  {loc.id}.
                </span>
                <div>
                  <h3 className={`tracking-[0.15em] text-sm font-medium mb-1 ${isActive ? 'text-mj-text' : ''}`}>
                    {loc.name}
                  </h3>
                  <div className={`overflow-hidden transition-all duration-500 ease-expo ${isActive ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <p className={`font-light text-xs md:text-sm ${loc.isComingSoon ? 'text-mj-accent italic' : 'text-gray-400'}`}>
                      {loc.address}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Map Area (Leaflet container) */}
      <div className="w-full lg:w-[60%] relative h-[50vh] lg:h-auto bg-[#1a1716] overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5 group z-0">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-mj-base via-transparent to-transparent opacity-60 z-[1000]"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-mj-base via-transparent to-transparent opacity-50 lg:hidden z-[1000]"></div>
        
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          scrollWheelZoom={false}
          className="w-full h-full custom-leaflet-map"
          zoomControl={false}
        >
          {/* Dark themed map tiles from CartoDB */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={mapCenter} zoom={14} />
          <CustomMarkers />
        </MapContainer>
      </div>
      
      {/* CSS to override leaflet internal z-indexes so it doesn't cover overall UI layers */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-leaflet-map {
          background-color: #191514 !important;
        }
        .leaflet-container .leaflet-pane {
          z-index: 10 !important;
        }
        .leaflet-container .leaflet-top,
        .leaflet-container .leaflet-bottom {
          z-index: 20 !important; 
        }
        .leaflet-container .leaflet-control-attribution {
          background: rgba(25, 21, 20, 0.7) !important;
          color: #8c827a !important;
          font-family: inherit !important;
          border-radius: 4px;
        }
        .leaflet-container .leaflet-control-attribution a {
          color: #C9A87C !important;
        }
      `}} />
    </section>
  );
}
