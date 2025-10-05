import { Timestamp } from "firebase/firestore";

export type FileTree = {
  name: string;
  path: string;
  url: string;
}


export type RepositoryDoc = {
  docId : string ;
  repoName: string;
  title: string;
  description: string;
  keywords: string;
  fileTree: FileTree[];
  createdAt: Timestamp ;
}

export type QuoteRequest = {
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  message: string;
  services: string[];
  createdAt: Timestamp ;
};

export type ContactRequest = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
  createdAt: Timestamp ;

};



export type NestedFileNode =
  | { name: string; type: "folder"; children: NestedFileNode[] }
  | { name: string; type: "file"; path: string; url: string };
