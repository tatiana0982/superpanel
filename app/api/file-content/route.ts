// app/api/file-content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { FirestoreService } from "@/firebase/firestoreService";
import { RepositoryDoc } from "@/types/types";

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("filePath");
  const repoName = req.nextUrl.searchParams.get("repoName");


  if (!filePath || !repoName) {
    return NextResponse.json({ error: "File and repoName required" }, { status: 400 });
  }

  const decodedFile = decodeURIComponent(filePath);
  const decodedrepoName = decodeURIComponent(repoName);


  const docs = await FirestoreService.getByConditions<RepositoryDoc>("Repositories", [
    {
      field : "repoName" ,
      operator : "==" ,
      value : decodedrepoName
    }
  ])

  if (docs.length === 0) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  const fileEntry = docs[0].fileTree.find(({ path }) => path === decodedFile);

  if (!fileEntry) {
    return NextResponse.json({ error: "File not found in repository" }, { status: 404 });
  }

  try {
    const response = await fetch(fileEntry.url);
    if (!response.ok) throw new Error("Failed to fetch file content");

    const content = await response.text();

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file content" }, { status: 500 });
  }
}
