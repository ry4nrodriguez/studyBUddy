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
