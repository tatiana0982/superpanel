import FileViewer from "@/components/FileViewer";
import { dump } from "@/helper/helper";


type FileViewParams = {
  params: Promise<{ 
    path: string[] ;
    repoName : string ; 
  }>;
};

export default async function FileViewPage({ params }: FileViewParams) {
  const {path , repoName } = await params;

  const filePath = path.join("/")

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4 text-white">File Preview</h1>
      <FileViewer filePath={filePath} repoName={repoName}/>
    </div>
  );
}
