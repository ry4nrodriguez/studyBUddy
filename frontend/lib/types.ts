// ============================================
// Raw data types (from bu_study_spaces.json)
// ============================================

export interface RawSlot {
    StartTime: string;
    EndTime: string;
}

export interface RawScheduleEntry {
    Slots: RawSlot[];
}

export interface RawRoom {
    roomNumber: string;
    schedule: RawScheduleEntry[];
}

export interface RawBuilding {
    name: string;
    code: string;
    coordinates: [number, number];
    address?: string;
    rooms: RawRoom[];
}

// ============================================
// Processed/response types (API response shape)
// ============================================

export type RoomSlotStatus = "available" | "upcoming" | "unavailable" | "passed";

export interface RoomSlot {
    StartTime: string;
    EndTime: string;
    Status: RoomSlotStatus;
}

export interface BuildingRoom {
    slots: RoomSlot[];
}

export interface BuildingData {
    building: string;
    building_code: string;
    building_status: RoomSlotStatus;
    rooms: Record<string, BuildingRoom>;
    coords: [number, number];
    distance: number;
}
