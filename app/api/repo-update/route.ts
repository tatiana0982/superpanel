// app/api/file-content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FirestoreService } from "@/firebase/firestoreService";
import { RepositoryDoc } from "@/types/types";

export async function POST(req: NextRequest) {
    try {
        // Parse JSON body instead of query parameters
        const { docId , repoName, title, description, keywords } = await req.json();


        if (!description || !repoName || !title || !keywords) {
            return NextResponse.json(
                { error: "docId ,  description, repoName, title and keywords are required" },
                { status: 400 }
            );
        }

        const doc = await FirestoreService.getDoc<RepositoryDoc>("Repositories",docId);

        if (!doc) {
            return NextResponse.json({ error: "Repository not found" }, { status: 404 });
        }

        await FirestoreService.updateDoc<RepositoryDoc>("Repositories", docId, {
            description: description,
            repoName: repoName,
            keywords: keywords,
            title: title
        })


        return NextResponse.json({
            message: "Repository updated successfully",
        });


    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}