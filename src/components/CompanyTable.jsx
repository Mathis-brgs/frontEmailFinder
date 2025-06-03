import React, { useState } from "react";
import { Mail, Building, AlertCircle, CheckCircle, Search } from "lucide-react";

const CompanyTable = ({
  companies,
  selectedDomain,
  onSelectDomain,
  onSnovioQuery,
  isFindingEmails,
}) => {
  const [snovioResults, setSnovioResults] = useState({});
  const [countLoading, setCountLoading] = useState({});
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "http://10.1.1.57:8000";
  const handleSnovioCount = async (domain) => {
    setCountLoading((prev) => ({ ...prev, [domain]: true }));

    try {
      const response = await fetch(`${API_URL}/api/snovio/count`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      setSnovioResults((prev) => ({
        ...prev,
        [domain]: data,
      }));
    } catch (error) {
      console.error("Erreur count Snovio:", error);
      setSnovioResults((prev) => ({
        ...prev,
        [domain]: {
          success: false,
          error: "Erreur de connexion",
          email_count: 0,
        },
      }));
    } finally {
      setCountLoading((prev) => ({ ...prev, [domain]: false }));
    }
  };

  const renderEmailStatus = (company) => {
    const domain = company.domain;
    const snovioData = snovioResults[domain];
    const isLoading = countLoading[domain];

    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Search className="w-3 h-3 animate-spin" />
          <span className="text-gray-500 text-xs">
            Vérification en cours...
          </span>
        </div>
      );
    }

    if (!snovioData) {
      return (
        <button
          onClick={() => handleSnovioCount(domain)}
          disabled={!domain}
          className="px-3 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Mail className="w-3 h-3" />
          Vérifier avec Snovio
        </button>
      );
    }

    if (!snovioData.success) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSnovioCount(domain)}
            className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            Réessayer
          </button>
        </div>
      );
    }

    if (snovioData.webmail) {
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-yellow-500" />
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Webmail
          </span>
        </div>
      );
    }

    if (snovioData.email_count === 0) {
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Aucun email
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3 text-green-500" />
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          {snovioData.email_count} emails disponibles
        </span>
      </div>
    );
  };

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
                SIREN
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Dénomination
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Classe d'établissement
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Vérification emails
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {company.siren || "N/A"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {company.company_name}
                </td>
                <td className="px-4 py-3 text-gray-600">{company.naf_label}</td>
                <td className="px-4 py-3">{renderEmailStatus(company)}</td>
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
