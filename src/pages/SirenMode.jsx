import { useState } from "react";
import { Trash, PlusCircle } from "lucide-react";
import SirenModal from "../components/SirenModal";

const SirenMode = () => {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Tri : { column: string, direction: 'asc' | 'desc' }
  const [sortConfig, setSortConfig] = useState(null);

  const handleAddCompanies = async (sirenList) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/companies/by-siren",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sirens: sirenList }),
        }
      );

      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Data is not iterable", data);
        return;
      }

      setCompanies((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Erreur appel backend :", error);
    }
  };

  const handleDeleteCompany = (siren) => {
    setCompanies((prev) => prev.filter((c) => c.siren !== siren));
  };

  const handleDeleteAll = () => {
    setCompanies([]);
  };

  // Fonction pour trier les données selon la colonne et direction
  const sortedCompanies = () => {
    if (!sortConfig) return companies;

    const { column, direction } = sortConfig;

    // Copie de l'array
    const sorted = [...companies];

    sorted.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Pour éviter erreurs null/undefined
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // Si c'est numérique on compare en nombre
      const isNumber = typeof aValue === "number" && typeof bValue === "number";

      if (!isNumber) {
        // On compare strings, en lowercase pour insensible à la casse
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Gestion clic tri sur titre
  const handleSort = (column) => {
    if (sortConfig && sortConfig.column === column) {
      // Toggle direction
      setSortConfig({
        column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // Nouvelle colonne, direction asc
      setSortConfig({ column, direction: "asc" });
    }
  };

  // Affiche la flèche dans le header trié
  const renderSortArrow = (column) => {
    if (!sortConfig || sortConfig.column !== column) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  // Colonnes et clé des champs correspondants
  const columns = [
    { label: "Nom", key: "company_name" },
    { label: "SIREN", key: "siren" },
    { label: "Nombre d'employés", key: "employees" },
    { label: "Domaine", key: "domain" },
    { label: "Code postal", key: "postal_code" },
    { label: "Actions", key: "actions" }, // Actions ne sera pas trié
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-gray-900">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Gestion des Entreprises
      </h1>

      <div className="flex flex-wrap justify-between mb-6 gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
          aria-label="Ajouter des SIREN"
        >
          <PlusCircle size={20} />
          Ajouter des SIREN
        </button>

        <button
          onClick={handleDeleteAll}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md shadow transition"
          aria-label="Tout supprimer"
        >
          Tout supprimer
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => key !== "actions" && handleSort(key)}
                  className={`px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer ${
                    key === "actions" ? "cursor-default" : "hover:bg-gray-200"
                  }`}
                  title={key !== "actions" ? `Trier par ${label}` : ""}
                  style={{ userSelect: "none" }}
                >
                  {label}
                  {renderSortArrow(key)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCompanies().length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-400 italic"
                >
                  Aucune entreprise affichée
                </td>
              </tr>
            ) : (
              sortedCompanies().map((c) => (
                <tr
                  key={c.siren}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td
                    className="px-4 py-3 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                    style={{ maxHeight: "48px", lineHeight: "1.5rem" }}
                  >
                    {c.company_name}
                  </td>
                  <td
                    className="px-4 py-3 font-mono whitespace-nowrap text-center"
                    style={{ maxHeight: "48px", lineHeight: "1.5rem" }}
                  >
                    {c.siren}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-center"
                    style={{ maxHeight: "48px", lineHeight: "1.5rem" }}
                  >
                    {c.employees}
                  </td>
                  <td
                    className="px-4 py-3 text-center lowercase text-blue-700 underline cursor-pointer hover:text-blue-900 whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis"
                    style={{ maxHeight: "48px", lineHeight: "1.5rem" }}
                  >
                    <a
                      href={`https://${c.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Visiter le site ${c.domain}`}
                    >
                      {c.domain}
                    </a>
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap text-center"
                    style={{ maxHeight: "48px", lineHeight: "1.5rem" }}
                  >
                    {c.postal_code}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteCompany(c.siren)}
                      title="Supprimer cette entreprise"
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      aria-label={`Supprimer l'entreprise ${c.company_name}`}
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SirenModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddCompanies}
        />
      )}
    </div>
  );
};

export default SirenMode;
