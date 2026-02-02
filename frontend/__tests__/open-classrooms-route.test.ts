import { describe, it, expect } from "vitest";

import { GET, POST } from "../app/api/open-classrooms/route";
import { getSlotStatus } from "../lib/availability";
import { haversineKm } from "../lib/distance";

describe("/api/open-classrooms route", () => {
    it("returns building data from GET", async () => {
        const response = await GET();
        expect(response.status).toBe(200);

        const payload = await response.json();
        expect(Array.isArray(payload)).toBe(true);

        // Should have building data with expected structure
        if (payload.length > 0) {
            const building = payload[0];
            expect(building).toHaveProperty("building");
            expect(building).toHaveProperty("building_code");
            expect(building).toHaveProperty("building_status");
            expect(building).toHaveProperty("rooms");
            expect(building).toHaveProperty("coords");
            expect(building).toHaveProperty("distance");
        }
    });

    it("returns sorted data when POST includes location", async () => {
        const request = new Request("http://localhost/api/open-classrooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: 42.35, lng: -71.1 }),
        });

        const response = await POST(request);
        expect(response.status).toBe(200);

        const payload = await response.json();
        expect(Array.isArray(payload)).toBe(true);

        // Check that distances are calculated and sorted
        if (payload.length > 1) {
            expect(payload[0].distance).toBeLessThanOrEqual(payload[1].distance);
        }
    });

    it("returns 400 for invalid location data", async () => {
        const request = new Request("http://localhost/api/open-classrooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: "invalid", lng: -71.1 }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const payload = await response.json();
        expect(payload).toHaveProperty("error");
    });

    it("returns 400 for out-of-range coordinates", async () => {
        const request = new Request("http://localhost/api/open-classrooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: 100, lng: -71.1 }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);

        const payload = await response.json();
        expect(payload.error).toContain("out of range");
    });
});

describe("getSlotStatus", () => {
    it("returns 'available' when current time is within slot", () => {
        const current = new Date();
        current.setHours(12, 0, 0, 0);

        const status = getSlotStatus(current, "09:00:00", "17:00:00");
        expect(status).toBe("available");
    });

    it("returns 'upcoming' when slot starts within 20 minutes", () => {
        const current = new Date();
        current.setHours(8, 50, 0, 0);

        const status = getSlotStatus(current, "09:00:00", "17:00:00");
        expect(status).toBe("upcoming");
    });

    it("returns 'passed' when slot has ended", () => {
        const current = new Date();
        current.setHours(18, 0, 0, 0);

        const status = getSlotStatus(current, "09:00:00", "17:00:00");
        expect(status).toBe("passed");
    });

    it("returns 'unavailable' when slot is far in the future", () => {
        const current = new Date();
        current.setHours(6, 0, 0, 0);

        const status = getSlotStatus(current, "09:00:00", "17:00:00");
        expect(status).toBe("unavailable");
    });

    it("handles midnight-spanning slots correctly", () => {
        // Test at 23:00 (should be available for a 22:00-02:00 slot)
        const current = new Date();
        current.setHours(23, 0, 0, 0);

        const status = getSlotStatus(current, "22:00:00", "02:00:00");
        expect(status).toBe("available");
    });

    it("handles midnight-spanning slots when after midnight", () => {
        // Test at 01:00 (should be available for a 22:00-02:00 slot)
        const current = new Date();
        current.setHours(1, 0, 0, 0);

        const status = getSlotStatus(current, "22:00:00", "02:00:00");
        expect(status).toBe("available");
    });
});

describe("haversineKm", () => {
    it("returns 0 for same coordinates", () => {
        const distance = haversineKm(42.35, -71.1, 42.35, -71.1);
        expect(distance).toBeCloseTo(0, 5);
    });

    it("calculates distance between two points", () => {
        // BU campus to Boston Common (approximately 2.5 km)
        const distance = haversineKm(42.3505, -71.1097, 42.3554, -71.0655);
        expect(distance).toBeGreaterThan(2);
        expect(distance).toBeLessThan(5);
    });

    it("handles international distances", () => {
        // Boston to London (approximately 5,265 km)
        const distance = haversineKm(42.35, -71.1, 51.5, -0.12);
        expect(distance).toBeGreaterThan(5000);
        expect(distance).toBeLessThan(6000);
    });
});
