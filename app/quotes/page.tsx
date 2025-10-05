import { FirestoreService } from "@/firebase/firestoreService";
import { QuoteRequest } from "@/types/types";
import Link from "next/link";

function getQuotes() {
  return FirestoreService.getAllDocs<QuoteRequest>("Quotes");
}

export default async function RepoTable() {
  const quoteRequests = await getQuotes();

  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg mt-4 min-w-[70vw]">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Quotes</h2>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-700 text-slate-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Company
            </th>
            <th scope="col" className="px-6 py-3">
              Employees
            </th>
            <th scope="col" className="px-6 py-3">
              Message
            </th>
            <th scope="col" className="px-6 py-3">
              Services
            </th>
            <th scope="col" className="px-6 py-3">
              Requested
            </th>
            {/* <th scope="col" className="px-6 py-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {quoteRequests.map((quote) => (
            <tr
              key={quote.id}
              className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-white">{quote.name}</td>

              <td className="px-6 py-4 font-medium text-white">
                {quote.email}
              </td>

              <td className="px-6 py-4 font-medium text-white">
                {quote.company}
              </td>

              <td className="px-6 py-4 font-medium text-white">
                {quote.employees}
              </td>

              <td className="px-6 py-4 font-medium text-white">
                {quote.message}
              </td>

              <td className="px-6 py-4 font-medium text-white">
                {quote.services.join(" , ")}
              </td>

              <td className="px-6 py-4">
                {quote.createdAt.toDate().toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
