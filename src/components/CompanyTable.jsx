// components/CompanyTable.jsx
import React, { useState } from "react";
import {
  Mail,
  ExternalLink,
  User,
  Building,
  MapPin,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";

const CompanyTable = ({
  companies,
  selectedDomain,
  onSelectDomain,
  onSnovioQuery,
  isFindingEmails,
}) => {
  const [snovioResults, setSnovioResults] = useState({});
  const [countLoading, setCountLoading] = useState({});

  const handleSnovioCount = async (domain) => {
    setCountLoading((prev) => ({ ...prev, [domain]: true }));

    try {
      const response = await fetch("http://localhost:8000/api/snovio/count", {
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

  // 🎨 Fonction pour afficher le statut après vérification
  const renderEmailStatus = (company) => {
    const domain = company.domain;
    const snovioData = snovioResults[domain];

    if (!snovioData) {
      return <span className="text-gray-400 text-xs">Non vérifié</span>;
    }

    if (!snovioData.success) {
      return (
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Erreur
          </span>
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

  // 🎯 Bouton Snovio simple
  const renderSnovioButton = (domain) => {
    const snovioData = snovioResults[domain];
    const isLoading = countLoading[domain];

    if (isLoading) {
      return (
        <button
          disabled
          className="px-3 py-1 text-xs rounded bg-gray-400 text-white cursor-not-allowed flex items-center gap-1"
        >
          <Search className="w-3 h-3 animate-spin" />
          Vérification...
        </button>
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
          Snovio
        </button>
      );
    }

    if (!snovioData.success) {
      return (
        <button
          onClick={() => handleSnovioCount(domain)}
          className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          Réessayer
        </button>
      );
    }

    if (snovioData.email_count > 0) {
      return (
        <button
          disabled
          className="px-3 py-1 text-xs rounded bg-green-600 text-white cursor-not-allowed flex items-center gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          {snovioData.email_count} emails ✓
        </button>
      );
    }

    return (
      <button
        disabled
        className="px-3 py-1 text-xs rounded bg-gray-500 text-white cursor-not-allowed flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" />
        Vérifié
      </button>
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
                Entreprise
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Industrie
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Taille
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Ville
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Domaine
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                📧 Statut emails
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => {
              const domain = company.domain;

              return (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {company.industry}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {company.size}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.city}
                  </td>
                  <td className="px-4 py-3">
                    {domain ? (
                      <a
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {domain}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400">Non trouvé</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{renderEmailStatus(company)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {renderSnovioButton(domain)}

                      <button
                        onClick={() => onSelectDomain(domain)}
                        className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                          selectedDomain === domain
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        <User className="w-3 h-3" />
                        Détails
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Message informatif simple */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>Cliquez sur "Snovio"</strong> pour vérifier gratuitement le
          nombre d'emails disponibles sur ce domaine.
        </p>
      </div>
    </div>
  );
};

export default CompanyTable;
