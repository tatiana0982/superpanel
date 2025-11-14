import { FirestoreService } from "@/firebase/firestoreService";
import { LabelDoc } from "@/types/types";
import Link from "next/link";

export const dynamic = "force-dynamic";


function getLabels() {
  return FirestoreService.getAllDocs<LabelDoc>("Labels");
}

export default async function RepoTable() {
  const labels = await getLabels();

  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg mt-4 min-w-[70vw]">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Labels </h2>
         <Link
          href="/labels/create"
          className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-md text-white transition-colors"
        >
          + Add Label
        </Link>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-700 text-slate-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
           
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {labels.map((contact) => (
            <tr
              key={contact.id}
              className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-white">
                {contact.name}
              </td>
               
              <td className="px-6 py-4">
                {contact.createdAt.toDate().toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
