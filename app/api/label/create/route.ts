import { FirestoreService } from "@/firebase/firestoreService";
import { LabelDoc } from "@/types/types";
import { Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Parse JSON body instead of query parameters
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: "label name is required" },
                { status: 400 }
            );
        }

        await FirestoreService.addDoc<LabelDoc>("Labels", {
            name: name,
            createdAt: Timestamp.now(),
        });

        return NextResponse.json({
            message: "Label created successfully",
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