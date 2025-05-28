import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Header from "./components/Header";
import CompanyFilters from "./components/CompanyFilters";
import CompanyTable from "./components/CompanyTable";
import ContactFilters from "./components/ContactFilters";
import ContactTable from "./components/ContactTable";
import { useCompanies, useContacts } from "./hooks/useData";

const App = () => {
  // États pour les filtres
  const [companyFilters, setCompanyFilters] = useState({
    industries: [],
    sizes: [],
    cities: [],
  });

  const [jobFilters, setJobFilters] = useState({
    position: "",
  });

  // États pour la sélection
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isFindingEmails, setIsFindingEmails] = useState(false);

  // Hooks personnalisés pour la gestion des données
  const {
    companies,
    loading: isSearching,
    error: companyError,
    searchCompanies,
    updateCompanyEmails,
    setCompanies,
  } = useCompanies();

  const {
    contacts,
    loading: isLoadingContacts,
    error: contactError,
    searchContacts,
    setContacts,
  } = useContacts();

  // Gestionnaires d'événements
  const handleCompanySearch = async () => {
    try {
      await searchCompanies(companyFilters);
    } catch (error) {
      console.error("Erreur lors de la recherche d'entreprises:", error);
    }
  };

  const handleSnovioQuery = async (domain) => {
    setIsFindingEmails(true);

    try {
      // Simulation API Snovio - à remplacer par vraie API
      setTimeout(() => {
        updateCompanyEmails(domain, {
          hasEmails: true,
          emailCount: Math.floor(Math.random() * 50) + 1,
        });
        setIsFindingEmails(false);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la requête Snovio:", error);
      setIsFindingEmails(false);
    }
  };

  const handleContactSearch = async () => {
    if (!selectedDomain) {
      console.warn("Aucun domaine sélectionné pour la recherche de contacts");
      return;
    }

    try {
      await searchContacts(selectedDomain, jobFilters);
    } catch (error) {
      console.error("Erreur lors de la recherche de contacts:", error);
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    // Réinitialiser les contacts quand on change de domaine
    setContacts([]);
  };

  // Fonction pour tout remettre à zéro
  const resetAll = () => {
    // Reset des filtres
    setCompanyFilters({
      industries: [],
      sizes: [],
      cities: [],
    });

    setJobFilters({
      position: "",
    });

    // Reset des données
    setCompanies([]);
    setContacts([]);

    // Reset de la sélection
    setSelectedDomain("");

    // Reset des états de chargement
    setIsFindingEmails(false);

    console.log("Application remise à zéro");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Header />

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {companies.length > 0 && (
              <span>{companies.length} entreprise(s) trouvée(s)</span>
            )}
            {contacts.length > 0 && selectedDomain && (
              <span className="ml-4">
                {contacts.length} contact(s) pour {selectedDomain}
              </span>
            )}
          </div>

          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            type="button"
          >
            <RotateCcw className="w-4 h-4" />
            Tout remettre à zéro
          </button>
        </div>

        {/* Gestion des erreurs */}
        {companyError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Erreur entreprises:</strong> {companyError}
          </div>
        )}

        {contactError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Erreur contacts:</strong> {contactError}
          </div>
        )}

        {/* Filtres des entreprises */}
        <CompanyFilters
          filters={companyFilters}
          onFiltersChange={setCompanyFilters}
          onSearch={handleCompanySearch}
          isSearching={isSearching}
        />

        {/* Table des entreprises */}
        {companies.length > 0 && (
          <CompanyTable
            companies={companies}
            selectedDomain={selectedDomain}
            onSelectDomain={handleDomainSelect}
            onSnovioQuery={handleSnovioQuery}
            isFindingEmails={isFindingEmails}
          />
        )}

        {/* Message si aucune entreprise */}
        {!isSearching &&
          companies.length === 0 &&
          companyFilters.industries.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune entreprise trouvée avec ces filtres.
            </div>
          )}

        {/* Filtres des contacts */}
        {selectedDomain && (
          <ContactFilters
            selectedDomain={selectedDomain}
            filters={jobFilters}
            onFiltersChange={setJobFilters}
            onSearch={handleContactSearch}
            isLoading={isLoadingContacts}
          />
        )}

        {/* Table des contacts */}
        {contacts.length > 0 && <ContactTable contacts={contacts} />}

        {/* Message si aucun contact */}
        {!isLoadingContacts &&
          selectedDomain &&
          contacts.length === 0 &&
          jobFilters.position && (
            <div className="text-center py-8 text-gray-500">
              Aucun contact trouvé pour "{jobFilters.position}" chez{" "}
              {selectedDomain}.
            </div>
          )}
      </div>
    </div>
  );
};

export default App;
