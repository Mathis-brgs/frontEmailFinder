import { Search, User } from "lucide-react";
import PosteSearchField from "./PosteSearchField";

const ContactFilters = ({
  selectedDomain,
  filters,
  onFiltersChange,
  onSearch,
  isLoading,
}) => {
  const handlePostesChange = (updaterFunction) => {
    if (typeof updaterFunction === "function") {
      const newFilters = updaterFunction(filters);

      if (newFilters.titles) {
        const positionString = newFilters.titles.join(",");
        onFiltersChange((prev) => ({
          ...prev,
          position: positionString,
        }));
      }
    } else {
      if (updaterFunction.titles) {
        const positionString = updaterFunction.titles.join(",");
        onFiltersChange((prev) => ({
          ...prev,
          position: positionString,
        }));
      }
    }
  };

  const adapatedFilters = {
    ...filters,
    titles: filters.position ? filters.position.split(",") : [],
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Recherche Contacts - {selectedDomain}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* PosteSearchField avec adaptation des données */}
        <div className="md:col-span-2 ">
          <PosteSearchField
            filters={adapatedFilters}
            onFilterChange={handlePostesChange}
          />
        </div>

        {/* Bouton recherche - logique originale conservée */}
        <div className="flex items-end">
          <button
            onClick={onSearch}
            disabled={isLoading || !filters.position}
            className={`w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              isLoading || !filters.position
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Recherche...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Rechercher Contacts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Affichage du résumé */}
      {filters.position && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-medium">
                Postes sélectionnés: {filters.position}
              </span>
              <span className="text-blue-600 ml-1">pour {selectedDomain}</span>
            </div>
            <button
              onClick={() =>
                onFiltersChange((prev) => ({ ...prev, position: "" }))
              }
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Tout effacer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactFilters;
