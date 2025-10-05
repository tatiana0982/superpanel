



import { NextRequest, NextResponse } from "next/server";
import { FirestoreService } from "@/firebase/firestoreService";
import { RepositoryDoc } from "@/types/types";




export async function GET(req: NextRequest) {

  const repoName = req.nextUrl.searchParams.get("repoName");

  if (!repoName) {
    return NextResponse.json({ error: "Repository name is required" }, { status: 400 });
  }

  const docs = await FirestoreService.getByConditions<RepositoryDoc>("Repositories", [
    {
      field : "repoName" ,
      operator : "==" ,
      value : repoName
    }
  ])

  if (docs.length === 0) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  const fileTree = docs[0].fileTree || [];

  return NextResponse.json({ fileTree });
};
