"use client";
import React from "react";
import { useRef, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { BuildingData } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [-71.1097, 42.3505];
const DEFAULT_ZOOM = 16;
const DEFAULT_PITCH = 45;

export default function Map({
    data,
    handleMarkerClick,
    userPos,
}: {
    data: BuildingData[];
    handleMarkerClick: (building: string) => void;
    userPos: [number, number] | null;
}) {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

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

    // Function to reset map to default position
    const resetMapPosition = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
                pitch: DEFAULT_PITCH,
                essential: true,
                duration: 1000,
            });
        }
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialize map with proper token and configuration
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
        
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: "mapbox://styles/mapbox/standard",
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            pitch: DEFAULT_PITCH,
            antialias: true, // Enable antialiasing for smoother rendering
            config: {
                basemap: {
                    lightPreset: "night",
                },
            },
        });

        return () => {
            // Clean up markers
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];

            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const mapInstance = mapRef.current;
        // Guard: map must exist and still be in the DOM (e.g. not removed by cleanup)
        if (!mapInstance?.getContainer()?.parentNode) return;

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        data.forEach((building) => {
            const el = document.createElement("button");
            el.type = "button";
            el.className = getColorByStatus(building.building_status);
            el.setAttribute(
                "aria-label",
                `${building.building} (${building.building_code})`
            );
            el.setAttribute("title", building.building);

            el.addEventListener("click", () => {
                const accordionItem = document.getElementById(
                    building.building_code
                );

                setTimeout(() => {
                    if (accordionItem) {
                        accordionItem.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        });
                    }
                }, 300);

                handleMarkerClick(building.building_code);
            });

            if (building.coords) {
                const marker = new mapboxgl.Marker(el)
                    .setLngLat([building.coords[0], building.coords[1]])
                    .addTo(mapInstance);

                markersRef.current.push(marker);
            }
        });

        if (userPos) {
            const e2 = document.createElement("div");
            e2.className =
                "h-3 w-3 border-[1.5px] border-zinc-50 rounded-full bg-blue-400 shadow-[0px_0px_4px_2px_rgba(14,165,233,1)]";

            const userMarker = new mapboxgl.Marker(e2)
                .setLngLat([userPos[1], userPos[0]])
                .addTo(mapInstance);

            markersRef.current.push(userMarker);
        }
    }, [data, handleMarkerClick, userPos]);

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
