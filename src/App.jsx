import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Header from "./components/Header";
import CompanyFilters from "./components/CompanyFilters";
import CompanyTable from "./components/CompanyTable";
import ContactFilters from "./components/ContactFilters";
import ContactTable from "./components/ContactTable";

const App = () => {
  // États pour les filtres
  const [companyFilters, setCompanyFilters] = useState({
    naf_sous_classes: [], // ✅ Changé de industries vers naf_sous_classes
    sizes: [],
    cities: [],
  });

  const [jobFilters, setJobFilters] = useState({
    position: "",
  });

  // États pour la sélection et le chargement
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isFindingEmails, setIsFindingEmails] = useState(false);

  // États pour les données entreprises
  const [companies, setCompanies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [companyError, setCompanyError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // États pour les contacts
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactError, setContactError] = useState("");

  // ============== GESTION ENTREPRISES ==============

  const handleCompanySearch = async (filters) => {
    if (!filters?.naf_sous_classes?.length) {
      console.error("Aucun code NAF sélectionné");
      return;
    }

    setIsSearching(true);
    setCompanies([]);

    try {
      const response = await fetch(
        `http://localhost:8000/api/companies/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            naf_sous_classes: filters.naf_sous_classes.map(
              (naf) => naf.libelle
            ),

            sizes: filters.sizes || [],
            cities: filters.cities || [],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanies(data || []);
      } else {
        console.error("Erreur lors de la recherche:", response.status);
        setCompanies([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'entreprises:", error);
      setCompanies([]);
    } finally {
      setIsSearching(false);
    }
  };

  const updateCompanyEmails = (domain, emailData) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.domain === domain ? { ...company, ...emailData } : company
      )
    );
  };

  // ============== GESTION CONTACTS ==============

  const handleSnovioQuery = async (domain) => {
    setIsFindingEmails(true);

    try {
      // Appel à l'API Snovio pour compter les emails
      const response = await fetch("http://localhost:8000/api/snovio/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      updateCompanyEmails(domain, {
        hasEmails: data.success && data.email_count > 0,
        emailCount: data.email_count,
        webmail: data.webmail,
        snovioChecked: true,
      });
    } catch (error) {
      console.error("Erreur lors de la requête Snovio:", error);
      updateCompanyEmails(domain, {
        hasEmails: false,
        emailCount: 0,
        snovioChecked: true,
        error: "Erreur de vérification",
      });
    } finally {
      setIsFindingEmails(false);
    }
  };

  const handleContactSearch = async () => {
    if (!selectedDomain) {
      setContactError(
        "Aucun domaine sélectionné pour la recherche de contacts"
      );
      return;
    }

    setIsLoadingContacts(true);
    setContactError("");
    setContacts([]);

    try {
      const queryParams = new URLSearchParams({
        domain: selectedDomain,
        ...(jobFilters.position && { job_titles: jobFilters.position }),
      });

      const response = await fetch(
        `http://localhost:8000/api/prospects?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();
      console.log("Résultats contacts:", data);

      if (data.results && data.results.length > 0) {
        setContacts(data.results);
      } else {
        setContactError(
          `Aucun contact trouvé${
            jobFilters.position ? ` pour "${jobFilters.position}"` : ""
          } chez ${selectedDomain}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de contacts:", error);
      setContactError(
        `Erreur lors de la recherche de contacts: ${error.message}`
      );
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setContacts([]); // Reset des contacts lors du changement de domaine
    setContactError("");
  };

  const resetAll = () => {
    // Reset des filtres
    setCompanyFilters({
      naf_sous_classes: [],
      sizes: [],
      cities: [],
    });

    setJobFilters({
      position: "",
    });

    setCompanies([]);
    setContacts([]);

    setSelectedDomain("");
    setIsFindingEmails(false);
    setCompanyError("");
    setContactError("");
    setSearchPerformed(false);

    console.log("🔄 Application remise à zéro");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Header />

        {/* Actions et statistiques */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {searchPerformed && (
              <span className="mr-4">
                {companies.length} entreprise(s) trouvée(s)
              </span>
            )}
            {contacts.length > 0 && selectedDomain && (
              <span className="mr-4">
                {contacts.length} contact(s) pour {selectedDomain}
              </span>
            )}
            {companyFilters.naf_sous_classes.length > 0 && (
              <span className="text-blue-600">
                {companyFilters.naf_sous_classes.length} code(s) NAF
                sélectionné(s)
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
            <button
              onClick={() => setCompanyError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {contactError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Erreur contacts:</strong> {contactError}
            <button
              onClick={() => setContactError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filtres des entreprises avec recherche NAF */}
        <CompanyFilters
          filters={companyFilters}
          onFiltersChange={setCompanyFilters}
          onSearch={handleCompanySearch}
          isSearching={isSearching}
        />

        {/* Contenu principal */}
        <div className="space-y-6">
          {/* Loading de recherche */}
          {isSearching && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">🔍 Recherche en cours...</p>
              <p className="text-sm text-gray-500 mt-2">
                Veuillez patienter pendant que nous trouvons les entreprises
                correspondant à vos critères.
              </p>
            </div>
          )}
          {/* Table des entreprises */}
          {!isSearching && companies.length > 0 && (
            <CompanyTable
              companies={companies}
              selectedDomain={selectedDomain}
              onSelectDomain={handleDomainSelect}
              onSnovioQuery={handleSnovioQuery}
              isFindingEmails={isFindingEmails}
            />
          )}
          {/* Message si aucune entreprise trouvée */}
          {!isSearching && searchPerformed && companies.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 mb-2">
                Aucune entreprise trouvée avec les libelle NAF sélectionnés.
              </p>
              <p className="text-sm text-gray-400">
                Essayez d'autres libelle d'activité ou vérifiez vos filtres.
              </p>
            </div>
          )}
        </div>

        {/* Section contacts - seulement si domaine sélectionné */}
        {selectedDomain && (
          <>
            <ContactFilters
              selectedDomain={selectedDomain}
              filters={jobFilters}
              onFiltersChange={setJobFilters}
              onSearch={handleContactSearch}
              isLoading={isLoadingContacts}
            />

            {/* Table des contacts */}
            {contacts.length > 0 && <ContactTable contacts={contacts} />}

            {/* Message si aucun contact trouvé */}
            {!isLoadingContacts &&
              contacts.length === 0 &&
              jobFilters.position && (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500 mb-2">
                    Aucun contact trouvé pour "{jobFilters.position}" chez{" "}
                    {selectedDomain}
                  </p>
                  <p className="text-sm text-gray-400">
                    Essayez d'autres intitulés de poste ou lancez une recherche
                    sans filtre.
                  </p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
