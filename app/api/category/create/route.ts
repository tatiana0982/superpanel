import { FirestoreService } from "@/firebase/firestoreService";
import { CategoryDoc } from "@/types/types";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse JSON body instead of query parameters
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: "category name is required" },
                { status: 400 }
            );
        }

        await FirestoreService.addDoc<CategoryDoc>("Categories", {
            name: name,
            createdAt: Timestamp.now(),
        });

        return NextResponse.json({
            message: "Category created successfully",
        });
    }

    catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }





}