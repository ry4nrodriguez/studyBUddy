// /app/api/open-classrooms/route.ts

import { NextResponse } from "next/server";
import type { BuildingData } from "@/lib/types";

// Backend URL - change this to your production URL when deploying
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export async function POST(req: Request) {
    try {
        // Extract user location from the request body
        const { lat, lng } = await req.json();

        // Send the user location to the backend
        const response = await fetch(
            `${BACKEND_URL}/api/open-classrooms`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lat, lng }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch data" },
                { status: 500 }
            );
        }

        // Get data from backend
        const data: BuildingData[] = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Fetch the default data without location
        const response = await fetch(
            `${BACKEND_URL}/api/open-classrooms`,
            {
                method: "GET",
                cache: "no-cache",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch data" },
                { status: 500 }
            );
        }

        // Get data from backend
        const data: BuildingData[] = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in GET route:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
