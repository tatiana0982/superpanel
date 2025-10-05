import { FirestoreService } from "@/firebase/firestoreService";
import { RepositoryDoc } from "@/types/types";
import Link from "next/link";

function getRepositories() {
  return FirestoreService.getAllDocs<RepositoryDoc>("Repositories");
}

export default async function RepoTable() {
  const repos = await getRepositories();

  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-lg shadow-lg mt-4 min-w-[70vw]">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white">Repositories</h2>
        <Link
          href="/add-repo"
          className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-md text-white transition-colors"
        >
          + Add Repo
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
              Files
            </th>
            <th scope="col" className="px-6 py-3">
              Created
            </th>
            {/* <th scope="col" className="px-6 py-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {repos.map((repo) => (
            <tr
              key={repo.id}
              className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-white">
                {repo.repoName}
              </td>
              <td className="px-6 py-4">
              <Link href={`/repos/${repo.repoName}`} className="bg-green-400 text-black" > View Files </Link>
              </td>
              <td className="px-6 py-4">
                {repo.createdAt.toDate().toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
