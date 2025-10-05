"use client";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export default function FileViewer({ filePath ,repoName }: { filePath: string , repoName : string }) {
  const [content, setContent] = useState("");

  console.log(filePath , repoName);
  

  useEffect(() => {
    fetch(`/api/file-content?filePath=${encodeURIComponent(filePath)}&repoName=${repoName}`)
      .then((res) => res.json())
      .then((data) => setContent(data.content));
  }, [filePath]);

  return (
    <SyntaxHighlighter language="javascript" >
      {content}
    </SyntaxHighlighter>
  );
}
