// /app/api/open-classrooms/route.ts
// Self-contained API route - no external backend required

import { NextResponse } from "next/server";
import { getSlotStatus, type SlotStatus } from "@/lib/availability";
import { haversineKm } from "@/lib/distance";
import type {
    RawBuilding,
    RawScheduleEntry,
    BuildingData,
    RoomSlot,
    RoomSlotStatus,
} from "@/lib/types";

// Import study space data directly
import buData from "@/data/bu_study_spaces.json";

// Type assertion for the imported JSON
const studySpaces = buData as RawBuilding[];

/**
 * Parse and validate user location from request payload.
 */
function parseLocation(payload: unknown): {
    lat: number | null;
    lng: number | null;
    error: string | null;
} {
    if (payload === null || typeof payload !== "object") {
        return { lat: null, lng: null, error: "No data provided" };
    }

    const data = payload as Record<string, unknown>;
    const userLat = data.lat;
    const userLng = data.lng;

    if (userLat === undefined || userLng === undefined) {
        return {
            lat: null,
            lng: null,
            error: "Invalid location data. 'lat' and 'lng' are required.",
        };
    }

    const lat = Number(userLat);
    const lng = Number(userLng);

    if (isNaN(lat) || isNaN(lng)) {
        return {
            lat: null,
            lng: null,
            error: "Invalid location data. 'lat' and 'lng' must be numbers.",
        };
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return {
            lat: null,
            lng: null,
            error: "Invalid location data. 'lat' or 'lng' out of range.",
        };
    }

    return { lat, lng, error: null };
}

/**
 * Extract all slots from a room's schedule entries.
 */
function iterSlots(
    schedule: RawScheduleEntry[] | undefined
): Array<{ startTime: string; endTime: string }> {
    if (!Array.isArray(schedule)) {
        return [];
    }

    const slots: Array<{ startTime: string; endTime: string }> = [];

    for (const entry of schedule) {
        if (typeof entry !== "object" || entry === null) {
            continue;
        }
        const rawSlots = entry.Slots;
        if (!Array.isArray(rawSlots)) {
            continue;
        }
        for (const slot of rawSlots) {
            if (typeof slot !== "object" || slot === null) {
                continue;
            }
            const startTime = slot.StartTime;
            const endTime = slot.EndTime;
            if (startTime && endTime) {
                slots.push({ startTime, endTime });
            }
        }
    }

    return slots;
}

/**
 * Process study space data and return building availability info.
 */
function processStudySpaces(
    userLat: number | null,
    userLng: number | null
): BuildingData[] {
    const currentTime = new Date();
    const buildingInfoList: BuildingData[] = [];

    for (const building of studySpaces) {
        const buildingName = building.name;
        const buildingCode = building.code;
        const buildingCoords = building.coordinates;

        if (!buildingName || !buildingCode) {
            continue;
        }

        const rooms: Record<string, { slots: RoomSlot[] }> = {};
        let buildingStatus: RoomSlotStatus = "unavailable";

        for (const room of building.rooms || []) {
            if (typeof room !== "object" || room === null) {
                continue;
            }
            const roomNumber = room.roomNumber;
            const schedule = room.schedule;

            if (!roomNumber) {
                continue;
            }

            const slotsWithStatus: RoomSlot[] = [];

            for (const { startTime, endTime } of iterSlots(schedule)) {
                const status: SlotStatus = getSlotStatus(
                    currentTime,
                    startTime,
                    endTime
                );

                // Update building status based on room availability
                if (buildingStatus !== "available" && status === "available") {
                    buildingStatus = "available";
                } else if (
                    buildingStatus === "unavailable" &&
                    status === "upcoming"
                ) {
                    buildingStatus = "upcoming";
                }

                // Only include slots that haven't passed
                if (status !== "passed") {
                    slotsWithStatus.push({
                        StartTime: startTime,
                        EndTime: endTime,
                        Status: status,
                    });
                }
            }

            if (slotsWithStatus.length > 0) {
                rooms[roomNumber] = { slots: slotsWithStatus };
            }
        }

        // Skip buildings with no available rooms
        if (Object.keys(rooms).length === 0) {
            continue;
        }

        // Calculate distance if user location is provided
        let distance = 0;
        if (
            userLat !== null &&
            userLng !== null &&
            Array.isArray(buildingCoords) &&
            buildingCoords.length === 2
        ) {
            // Note: coordinates are [longitude, latitude] in the JSON
            distance = haversineKm(
                userLat,
                userLng,
                buildingCoords[1],
                buildingCoords[0]
            );
        }

        buildingInfoList.push({
            building: buildingName,
            building_code: buildingCode,
            building_status: buildingStatus,
            rooms,
            coords: buildingCoords,
            distance,
        });
    }

    // Sort by distance if user location was provided
    if (userLat !== null && userLng !== null) {
        buildingInfoList.sort((a, b) => a.distance - b.distance);
    }

    return buildingInfoList;
}

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { lat, lng, error } = parseLocation(payload);

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        const data = processStudySpaces(lat, lng);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in POST route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const data = processStudySpaces(null, null);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in GET route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
