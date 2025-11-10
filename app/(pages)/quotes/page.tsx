import { FirestoreService } from "@/firebase/firestoreService";
import { QuoteRequest } from "@/types/types";

export const dynamic = "force-dynamic";

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

      {/* table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-sm text-left text-slate-300 ">
          <thead className="bg-slate-700 text-slate-200">
            <tr>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Name
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Email
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Company
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Employees
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Phone
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Message
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Services
              </th>
              <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                Requested At
              </th>
            </tr>
          </thead>

          <tbody>
            {quoteRequests.map((quote) => (
              <tr
                key={quote.id}
                className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.name}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.email}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.company}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.employees}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.phone}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.message}
                </td>
                <td className="px-4 py-3 sm:px-6 font-medium text-white">
                  {quote.services.join(", ")}
                </td>
                <td className="px-4 py-3 sm:px-6">
                  {quote.createdAt.toDate().toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
