"use client";
import Left from "@/components/Left";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/Loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { BuildingData } from "@/lib/types";
import dynamic from "next/dynamic";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Github, Linkedin, Twitter } from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
    const [data, setData] = useState<BuildingData[]>([]);
    const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
    const [userPos, setUserPos] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [locationMessage, setLocationMessage] = useState<string | null>(null);

    const handleMarkerClick = (building: string) => {
        setActiveBuilding(building);
    };

    const statusCounts = useMemo(() => {
        const counts = {
            total: Array.isArray(data) ? data.length : 0,
            available: 0,
            upcoming: 0,
            unavailable: 0,
        };

        data.forEach((building) => {
            if (building.building_status === "available") {
                counts.available += 1;
            } else if (building.building_status === "upcoming") {
                counts.upcoming += 1;
            } else if (building.building_status === "unavailable") {
                counts.unavailable += 1;
            }
        });

        return counts;
    }, [data]);

    useEffect(() => {
        const fetchLocationAndData = async () => {
            setLoading(true);
            setErrorMessage(null);
            setLocationMessage(null);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserPos([latitude, longitude]);
                        try {
                            // Send the user's location to the backend
                            const res = await fetch("/api/open-classrooms", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    lat: latitude,
                                    lng: longitude,
                                }),
                            });

                            if (!res.ok) {
                                throw new Error("Failed to fetch study space data.");
                            }
                            const json = await res.json();
                            setData(Array.isArray(json) ? json : []);
                        } catch (error) {
                            console.error("Failed to fetch data from backend:", error);
                            setErrorMessage(
                                "Unable to reach the backend. Please try again in a moment."
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                    async (error) => {
                        console.error("Error fetching location here:", error);
                        setLocationMessage(
                            "Location access was denied. Showing unsorted results."
                        );

                        // Fallback to fetching unsorted data
                        try {
                            const res = await fetch("/api/open-classrooms");
                            if (!res.ok) {
                                throw new Error("Failed to fetch study space data.");
                            }
                            const defaultData = await res.json();
                            setData(Array.isArray(defaultData) ? defaultData : []);
                        } catch (fallbackError) {
                            console.error(
                                "Failed to fetch data from backend:",
                                fallbackError
                            );
                            setErrorMessage(
                                "Unable to reach the backend. Please try again in a moment."
                            );
                        } finally {
                            setLoading(false);
                        }
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setLocationMessage(
                    "Geolocation is not supported by this browser. Showing unsorted results."
                );
                try {
                    const res = await fetch("/api/open-classrooms", {
                        method: "GET",
                    });
                    if (!res.ok) {
                        throw new Error("Failed to fetch study space data.");
                    }
                    const defaultData = await res.json();
                    setData(Array.isArray(defaultData) ? defaultData : []);
                } catch (fallbackError) {
                    console.error("Failed to fetch data from backend:", fallbackError);
                    setErrorMessage(
                        "Unable to reach the backend. Please try again in a moment."
                    );
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLocationAndData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const header = (
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
            <div className="rounded-2xl border border-zinc-800/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 shadow-sm px-4 sm:px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-scarlet-500/15 border border-scarlet-500/30 flex items-center justify-center text-scarlet-400 font-semibold">
                            BU
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-scarlet-500">
                                Study BUddy
                            </h1>
                            <p className="text-xs sm:text-sm text-zinc-400">
                                Live classroom availability across campus
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <div className="rounded-full bg-green-800/20 text-green-300/90 text-xs sm:text-sm px-3 py-1">
                            Open {statusCounts.available}
                        </div>
                        <div className="rounded-full bg-amber-800/20 text-amber-300/90 text-xs sm:text-sm px-3 py-1">
                            Soon {statusCounts.upcoming}
                        </div>
                        <div className="rounded-full bg-red-800/20 text-red-300/90 text-xs sm:text-sm px-3 py-1">
                            Closed {statusCounts.unavailable}
                        </div>
                        <Popover>
                            <PopoverTrigger className="rounded-full border border-zinc-700/70 bg-zinc-900/70 p-2 text-zinc-200 hover:bg-zinc-800/70 transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={22}
                                    height={22}
                                    fill={"none"}
                                >
                                    <path
                                        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />
                                    <path
                                        d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M11.992 8H12.001"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </PopoverTrigger>
                            <PopoverContent className="bg-zinc-900 border-zinc-600 text-zinc-200 w-72">
                                <div className="font-bold mb-1">
                                    Important Notes:
                                </div>
                                <ul className="list-disc pl-4">
                                    <li>
                                        Building/room access may be restricted to
                                        specific colleges or departments
                                    </li>
                                    <li>
                                        Displayed availability only reflects
                                        official class schedules
                                    </li>
                                    <li>
                                        Rooms may be occupied by unofficial meetings
                                        or study groups
                                    </li>
                                    <li>
                                        Click on indicators to view room schedules
                                        for that building
                                    </li>
                                </ul>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-800/70 px-2 py-1">
                        {statusCounts.total} buildings
                    </span>
                    <span className="rounded-full bg-zinc-800/70 px-2 py-1">
                        Map + list view
                    </span>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span className="text-zinc-500">Built by Ryan Rodriguez</span>
                    <a
                        href="https://ryanrodriguez.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-scarlet-400 transition"
                    >
                        Website
                    </a>
                    <a
                        href="https://github.com/ry4nrodriguez"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-zinc-400 hover:text-scarlet-400 transition inline-flex"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ryanrodriguez-/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-zinc-400 hover:text-scarlet-400 transition inline-flex"
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                        href="https://x.com/ry4nrodriguez_"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X (Twitter)"
                        className="text-zinc-400 hover:text-scarlet-400 transition inline-flex"
                    >
                        <Twitter className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <main className="flex flex-col sm:flex-row sm:gap-4 h-screen">
            <div className="basis-2/5 sm:h-full order-last sm:order-first py-4 sm:px-0 sm:py-2 overflow-hidden sm:flex sm:flex-col">
                <div className="hidden sm:block">{header}</div>
                <ScrollArea className="h-full">
                    <div className="sm:hidden">{header}</div>
                    <Left
                        data={data}
                        activeBuilding={activeBuilding}
                        setActiveBuilding={setActiveBuilding}
                        errorMessage={errorMessage}
                        locationMessage={locationMessage}
                    />
                </ScrollArea>
            </div>
            <div className="h-[60vh] basis-3/5 sm:h-screen">
                {errorMessage ? (
                    <div className="p-4">
                        <Alert>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    </div>
                ) : null}
                <Map
                    data={data}
                    handleMarkerClick={handleMarkerClick}
                    userPos={userPos}
                />
            </div>
        </main>
    );
}
