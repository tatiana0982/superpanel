import { FirestoreService } from "@/firebase/firestoreService";
import { ContactRequest } from "@/types/types";

function getContacts() {
  return FirestoreService.getAllDocs<ContactRequest>("Contacts");
}

export default async function RepoTable() {
  const contactRequests = await getContacts();

  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg mt-4 min-w-[70vw]">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Contact Requests</h2>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="bg-slate-700 text-slate-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Message
            </th>
            <th scope="col" className="px-6 py-3">
              Company
            </th>
            
            <th scope="col" className="px-6 py-3">
              Requested At
            </th>
          </tr>
        </thead>
        <tbody>
          {contactRequests.map((contact) => (
            <tr
              key={contact.id}
              className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-white">
                {contact.email}
              </td>
               <td className="px-6 py-4 font-medium text-white">
                {contact.firstName + " " + contact.lastName}
              </td>
              <td className="px-6 py-4 font-medium text-white">
                {contact.message}
              </td>
              <td className="px-6 py-4 font-medium text-white">
                {contact.company}
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
