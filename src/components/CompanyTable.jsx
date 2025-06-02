import { Building } from "lucide-react";

const CompanyTable = ({ companies }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Building className="w-5 h-5" />
        Entreprises trouvées ({companies.length})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Dénomination
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Classe d'établissement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {company.company_name}
                </td>
                <td className="px-4 py-3 text-gray-600">{company.naf_label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {companies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune entreprise trouvée pour les critères sélectionnés
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
