"use client";
import React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface dataFormat {
    building: string;
    building_code: string;
    building_status: string;
    rooms: {
        [key: string]: {
            roomNumber: string;
            slots: { StartTime: string; EndTime: string; Status: string }[];
        };
    };
    coords: [number, number];
    distance: number;
}

// Light presets based on time of day
type LightPreset = "dawn" | "day" | "dusk" | "night";

export default function Map({
    data,
    handleMarkerClick,
    userPos,
}: {
    data: dataFormat[];
    handleMarkerClick: (building: string) => void;
    userPos: any;
}) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    // Default center coordinates for Boston University
    const defaultCenter: [number, number] = [-71.1097, 42.3505];
    const defaultZoom = 15;
    const defaultPitch = 45;

    const [center, setCenter] = useState<[number, number]>(defaultCenter);
    const [zoom, setZoom] = useState(defaultZoom);
    const [pitch, setPitch] = useState(defaultPitch);
    const [currentLightPreset, setCurrentLightPreset] = useState<LightPreset>("day");

    function getColorByStatus(status: string) {
        switch (status) {
            case "available":
                return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
            case "unavailable":
                return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
            case "upcoming":
                return "h-2 w-2 rounded-full bg-amber-400 shadow-[0px_0px_4px_2px_rgba(245,158,11,0.9)]";
            default:
                return "gray";
        }
    }

    // Function to determine light preset based on current time
    const getLightPresetByTime = useCallback((): LightPreset => {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 8) return "dawn";
        if (hour >= 8 && hour < 17) return "day";
        if (hour >= 17 && hour < 20) return "dusk";
        return "night";
    }, []);

    // Function to reset map to default position
    const resetMapPosition = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: defaultCenter,
                zoom: defaultZoom,
                pitch: defaultPitch,
                essential: true,
                duration: 1000
            });
        }
    }, [defaultCenter, defaultZoom, defaultPitch]);

    // Function to update map lighting based on time
    const updateMapLighting = useCallback(() => {
        const newLightPreset = getLightPresetByTime();
        
        if (newLightPreset !== currentLightPreset) {
            setCurrentLightPreset(newLightPreset);
        }
    }, [currentLightPreset, getLightPresetByTime]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize map with proper token and configuration
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1Ijoicnk0bnJvZHJpZ3VleiIsImEiOiJjbTdwNm9vMG0wajczMmlxNGxrZHptODVmIn0.xzq0r5ewGo_Or7vnsgKWyg";
        
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: 'mapbox://styles/mapbox/standard',
            center: center,
            zoom: zoom,
            pitch: pitch,
            antialias: true // Enable antialiasing for smoother rendering
        });

        // Set initial light preset based on time
        const initialLightPreset = getLightPresetByTime();
        setCurrentLightPreset(initialLightPreset);

        // Wait for map to load before adding markers
        mapRef.current.on("load", () => {
            if (mapRef.current) {
                // Add markers for each building after map is fully loaded
                addMarkersToMap();
            }
        });

        // Function to add markers to the map
        const addMarkersToMap = () => {
            // Clear any existing markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            
            // Add markers for each building
            data.forEach((data) => {
                const el = document.createElement("div");
                el.className = getColorByStatus(data.building_status);

                el.addEventListener("click", () => {
                    const accordionItem = document.getElementById(
                        data.building_code
                    );

                    setTimeout(() => {
                        if (accordionItem) {
                            accordionItem.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }
                    }, 300);

                    handleMarkerClick(data.building_code);
                });

                if (mapRef.current && data.coords) {
                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([data.coords[0], data.coords[1]])
                        .addTo(mapRef.current);
                    
                    markersRef.current.push(marker);
                }
            });

            // Add user position marker
            if (userPos && mapRef.current) {
                const e2 = document.createElement("div");
                e2.className =
                    "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

                const userMarker = new mapboxgl.Marker(e2)
                    .setLngLat([userPos[1], userPos[0]])
                    .addTo(mapRef.current);
                
                markersRef.current.push(userMarker);
            }
        };

        mapRef.current.on("move", () => {
            if (mapRef.current) {
                const mapCenter = mapRef.current.getCenter();
                const mapZoom = mapRef.current.getZoom();
                const mapPitch = mapRef.current.getPitch();

                setCenter([mapCenter.lng, mapCenter.lat]);
                setZoom(mapZoom);
                setPitch(mapPitch);
            }
        });

        // Set up interval to update lighting based on time
        const lightingInterval = setInterval(updateMapLighting, 60000); // Check every minute

        return () => {
            clearInterval(lightingInterval);
            
            // Clean up markers
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    return (
        <div className="h-[60vh] sm:w-full sm:h-full relative bg-red-500/0 rounded-[20px] p-2 sm:p-0">
            <div
                id="map-container"
                ref={mapContainerRef}
                className="opacity-100 h-full w-full rounded-[20px] overflow-hidden"
            />
            
            {/* Reset Button */}
            <button 
                onClick={resetMapPosition}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-zinc-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 z-10"
                aria-label="Reset map view"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Reset View
            </button>
            
            {/* Light Preset Indicator */}
            <div className="absolute top-4 left-4 bg-zinc-800/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium z-10">
                {currentLightPreset === "dawn" && "Dawn 🌅"}
                {currentLightPreset === "day" && "Day ☀️"}
                {currentLightPreset === "dusk" && "Dusk 🌆"}
                {currentLightPreset === "night" && "Night 🌙"}
            </div>
            
            {/* Legend */}
            <div className="bg-[#18181b]/90 absolute bottom-10 left-2 sm:bottom-8 sm:left-0 flex flex-col gap-2 m-1 py-2.5 p-2 rounded-[16px] z-10">
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-red-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-red-700/30 text-red-300/90">
                        unavailable
                    </div>
                </div>
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-amber-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-amber-800/30 text-amber-300/90">
                        opening soon
                    </div>
                </div>
                <div className="flex items-center gap-0">
                    <div className="h-2 w-2 rounded-full bg-green-400 flex-none"></div>
                    <div className="ml-2 rounded-lg px-2 py-1 text-sm w-full bg-green-800/30 text-green-300/90">
                        open now
                    </div>
                </div>
            </div>
        </div>
    );
}
