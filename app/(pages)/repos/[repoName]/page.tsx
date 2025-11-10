import FileExplorer from "@/components/FileExplorer";
import { dump } from "@/helper/helper";
import { FileTree, NestedFileNode } from "@/types/types";
import { headers } from "next/headers";

type RepoParams = {
  params: Promise<{ repoName: string }>;
};

async function fetchFileTree(repoName: string) {
  const headersList = await headers(); 
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "http"; // add fallback
  const url = `${proto}://${host}/api/repo-file-tree?repoName=${encodeURIComponent(
    repoName
  )}`;

  const res = await fetch(url);
  return res.json();
}

function generateNestedFileTree(fileTree: FileTree[]): NestedFileNode[] {
  const root: NestedFileNode[] = [];

  fileTree.forEach(({ name, path, url }) => {
    const parts = path.split("/"); // e.g., ["src", "index.js"]
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      let existing = current.find((node) => node.name === part);

      if (!existing) {
        existing = isFile
          ? { name: part, type: "file", path, url }
          : { name: part, type: "folder", children: [] };

        current.push(existing);
      }

      if (!isFile) {
        current = (existing as { children: NestedFileNode[] }).children;
      }
    }
  });

  return root;
}

export default async function RepoPage({ params }: RepoParams) {
  const { repoName } = await params;

  const decodedRepoName = decodeURIComponent(repoName);

  const { fileTree }: { fileTree: FileTree[] } = await fetchFileTree(
    decodedRepoName
  );

  const nestedTree = generateNestedFileTree(fileTree);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">
        {" "}
        Repository {decodedRepoName}{" "}
      </h1>
      <FileExplorer tree={nestedTree} repoName={decodedRepoName} />
    </div>
  );
}
