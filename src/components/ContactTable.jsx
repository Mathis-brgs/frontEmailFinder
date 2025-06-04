import { Mail, ExternalLink, Briefcase } from "lucide-react";

const ContactTable = ({ contacts, hasSearched }) => {
  if (!hasSearched) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Mail className="w-5 h-5" />
        Contacts trouvés ({contacts.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Prénom
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Poste
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                LinkedIn
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {contact.first_name}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {contact.last_name}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-4 h-4" />
                      {contact.emails}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {contact.position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      LinkedIn
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Aucun contact trouvé pour cette recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
