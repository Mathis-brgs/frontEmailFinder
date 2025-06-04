import { Search, Filter, ChevronDown, X } from "lucide-react";
import { useState, useCallback } from "react";
import NAFSearchField from "./NAFSearchField";

const CompanyFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  isSearching,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [cityInputRef] = useState(null);

  const [filtersDisabled] = useState(false);

  const handleFilterChange = useCallback(
    (field, value) => {
      onFiltersChange((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [onFiltersChange]
  );

  const handleMultiSelectChange = useCallback(
    (field, value) => {
      const currentValues = filters[field] || [];
      let newValues;

      if (currentValues.includes(value)) {
        newValues = currentValues.filter((item) => item !== value);
      } else {
        newValues = [...currentValues, value];
      }

      handleFilterChange(field, newValues);
    },
    [filters, handleFilterChange]
  );

  const removeFilter = useCallback(
    (field, value) => {
      const currentValues = filters[field] || [];
      const newValues = currentValues.filter((item) => item !== value);
      handleFilterChange(field, newValues);
    },
    [filters, handleFilterChange]
  );

  const toggleDropdown = useCallback((field) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const addCity = useCallback(
    (cityValue) => {
      if (cityValue.trim()) {
        const cities = cityValue
          .split(",")
          .map((city) => city.trim())
          .filter((city) => city);
        const currentCities = filters.cities || [];
        const newCities = [...new Set([...currentCities, ...cities])];
        handleFilterChange("cities", newCities);
      }
    },
    [filters.cities, handleFilterChange]
  );

  const handleCityKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = e.target.value;
        if (value.trim()) {
          addCity(value);
          e.target.value = "";
        }
      }
    },
    [addCity]
  );

  const handleCityBlur = useCallback(
    (e) => {
      const value = e.target.value;
      if (value.trim()) {
        addCity(value);
        e.target.value = "";
      }
    },
    [addCity]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      naf_sous_classes: [],
      sizes: [],
      cities: [],
    });
  }, [onFiltersChange]);

  const handleSearch = useCallback(() => {
    if (!filters.naf_sous_classes || filters.naf_sous_classes.length === 0) {
      alert(
        "Veuillez sélectionner au moins un code NAF pour effectuer la recherche."
      );
      return;
    }
    onSearch(filters);
  }, [filters, onSearch]);

  const sizeOptions = [
    { label: "Etablissement non employeur" },
    { label: "3 à 5 salariés" },
    { label: "6 à 9 salariés" },
    { label: "10 à 19 salariés" },
    { label: "20 à 49 salariés" },
    { label: "50 à 99 salariés" },
    { label: "100 à 199 salariés" },
    { label: "200 à 249 salariés" },
    { label: "250 à 499 salariés" },
    { label: "500 à 999 salariés" },
    { label: "1 000 à 1 999 salariés" },
    { label: "2 000 à 4 999 salariés" },
    { label: "5 000 à 9 999 salariés" },
    { label: "10 000 salariés et plus" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Filtres Entreprises
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* NAF Search Field Component */}
        <NAFSearchField filters={filters} onFilterChange={handleFilterChange} />

        {/* Filtre Tailles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tailles
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => !filtersDisabled && toggleDropdown("sizes")} // TODO: réactiver ici
              className={`w-full p-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between ${
                filtersDisabled
                  ? "pointer-events-none opacity-50"
                  : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
            >
              <span
                className={
                  (filters.sizes?.length || 0) === 0
                    ? "text-gray-500"
                    : "text-gray-900"
                }
              >
                {(filters.sizes?.length || 0) === 0
                  ? "Toutes les tailles"
                  : `${filters.sizes?.length || 0} sélection(s)`}
              </span>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openDropdowns.sizes ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdowns.sizes &&
              !filtersDisabled && ( // filtres désactivés avant implementation de la recherche par taille et ville
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {sizeOptions.map((option, index) => (
                    <label
                      key={index} // Utilisez l'index comme clé
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.sizes || []).includes(option.label)} // Utilisez le label
                        onChange={() =>
                          handleMultiSelectChange("sizes", option.label)
                        } // Passez le label
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Filtre Villes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Villes
          </label>
          <input
            ref={cityInputRef}
            type="text"
            className={`w-full p-3 border border-gray-300 rounded-lg ${
              filtersDisabled
                ? "pointer-events-none opacity-50"
                : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            }`}
            placeholder="Tapez une ville et appuyez sur Entrée"
            onKeyDown={filtersDisabled ? undefined : handleCityKeyPress} // filtres désactivés avant implementation de la recherche par taille et ville
            onBlur={filtersDisabled ? undefined : handleCityBlur} // filtres désactivés avant implementation de la recherche par taille et ville
            autoComplete="off"
          />
          {filters.cities && filters.cities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {city}
                  <button
                    onClick={() => removeFilter("cities", city)}
                    className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-purple-500 hover:bg-purple-200"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Rechercher */}
        <div>
          <label className="block text-sm font-medium mb-2 invisible">
            Rechercher
          </label>
          <button
            onClick={handleSearch}
            disabled={
              isSearching ||
              !filters.naf_sous_classes ||
              filters.naf_sous_classes.length === 0
            }
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            type="button"
          >
            <Search className="w-4 h-4" />
            {isSearching ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {((filters.naf_sous_classes && filters.naf_sous_classes.length > 0) ||
        (filters.sizes && filters.sizes.length > 0) ||
        (filters.cities && filters.cities.length > 0)) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Filtres actifs:{" "}
              {(filters.naf_sous_classes?.length || 0) +
                (filters.sizes?.length || 0) +
                (filters.cities?.length || 0)}{" "}
              sélection(s)
            </span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Effacer tout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyFilters;
