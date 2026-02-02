import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET, POST } from "../app/api/open-classrooms/route";

describe("/api/open-classrooms route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns data from GET", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    // @ts-expect-error - mock global fetch for tests
    global.fetch = mockFetch;

    const response = await GET();
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual([]);
  });

  it("posts location data on POST", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    // @ts-expect-error - mock global fetch for tests
    global.fetch = mockFetch;

    const request = new Request("http://localhost/api/open-classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: 42.35, lng: -71.1 }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalled();
  });
});
