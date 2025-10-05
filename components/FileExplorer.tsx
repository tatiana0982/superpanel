"use client";
import { NestedFileNode } from "@/types/types";
import Link from "next/link";
import { useState } from "react";

export default function FileExplorer({
  tree,
  repoName,
  level = 0, // Track nesting level for indentation
}: {
  tree: NestedFileNode[];
  repoName: string;
  level?: number;
}) {
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});

  return (
    <ul className="list-none">
      {tree.map((node, idx) => (
        <li key={idx} style={{ paddingLeft: `${level * 20}px` }}>
          {node.type === "folder" ? (
            <>
              <span
                onClick={() =>
                  setOpenFolders({
                    ...openFolders,
                    [node.name]: !openFolders[node.name],
                  })
                }
                className="cursor-pointer font-semibold text-white"
              >
                📁 {node.name}
              </span>

              {openFolders[node.name] && (
                <FileExplorer
                  tree={node.children}
                  repoName={repoName}
                  level={level + 1}
                />
              )}
            </>
          ) : (
            <Link
              href={`/repos/${repoName}/${node.path.replace(/\\/g, "/")}`}
              className="text-white hover:underline"
            >
              📄 {node.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
