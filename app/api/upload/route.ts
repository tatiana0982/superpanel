import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import { FirestoreService } from "@/firebase/firestoreService";
import { Timestamp } from "firebase/firestore";
import { FileTree, RepositoryDoc } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const keywords = formData.get("keywords") as string;




    if (!file || !name || !title || !description || !keywords ) {
      return NextResponse.json(
        { error: "Missing file or name or title or description or keywords" }, 
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a ZIP file" },
        { status: 400 }
      );
    }

    const docs = await FirestoreService.getByConditions<RepositoryDoc>("Repositories",[
      {
        field : 'repoName' , operator : '==' , value : name
      }
    ]) 

    if (docs.length > 0) {
       return NextResponse.json(
        { error: "Repository  already exists" },
        { status: 400 }
      );
      
    }

    const zipBuffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();
    const fileTree: FileTree[] = [];

    const docId = FirestoreService.docId()

    // Process each file in the ZIP
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      try {
        const filePath = entry.entryName.split('/').slice(1).join('/');
        const fileContent = entry.getData();

        const fileUrl = await FirestoreService.uploadFile(fileContent , docId , name, filePath);

        fileTree.push({
          name: entry.name,
          path: filePath,
          url: fileUrl,
        });
      } catch (fileError) {
        console.error(`Error processing file ${entry.entryName}:`, fileError);
        // Continue processing other files even if one fails
        continue;
      }
    }

    // Check if any files were successfully processed
    if (fileTree.length === 0) {
      return NextResponse.json(
        { error: "No valid files found in the ZIP archive" },
        { status: 400 }
      );
    }




    // Save metadata in Firestore
    await FirestoreService.setDoc<RepositoryDoc>("Repositories", docId, {
      docId : docId ,
      repoName : name ,
      title : title ,
      description : description,
      keywords : keywords ,
      fileTree : fileTree,
      createdAt : Timestamp.now()
    });

    return NextResponse.json({ 
      message: "Uploaded to Firebase Storage and Firestore", 
      fileTree,
    });

  } catch (error) {
    console.error("Error processing ZIP upload:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to process ZIP file",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};