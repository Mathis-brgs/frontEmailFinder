import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const CompanyFilters = ({
  filters,
  onFiltersChange,
  onSearch,
  isSearching,
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleFilterChange = (field, value) => {
    onFiltersChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = filters[field] || [];
    let newValues;

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((item) => item !== value);
    } else {
      newValues = [...currentValues, value];
    }

    handleFilterChange(field, newValues);
  };

  const removeFilter = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.filter((item) => item !== value);
    handleFilterChange(field, newValues);
  };

  const toggleDropdown = (field) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const addCity = (cityValue) => {
    if (cityValue.trim()) {
      const cities = cityValue
        .split(",")
        .map((city) => city.trim())
        .filter((city) => city);
      const currentCities = filters.cities || [];
      const newCities = [...new Set([...currentCities, ...cities])];
      handleFilterChange("cities", newCities);
    }
  };

  const handleCityKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCity(e.target.value);
      e.target.value = "";
    }
  };

  const MultiSelectDropdown = ({
    field,
    options,
    placeholder,
    selectedValues = [],
  }) => {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(field)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
        >
          <span
            className={
              selectedValues.length === 0 ? "text-gray-500" : "text-gray-900"
            }
          >
            {selectedValues.length === 0
              ? placeholder
              : `${selectedValues.length} sélection(s)`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openDropdowns[field] ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdowns[field] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleMultiSelectChange(field, option.value)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Tags des valeurs sélectionnées */}
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {option ? option.label : value}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFilter(field, value);
                    }}
                    className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-blue-500 hover:bg-blue-200"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const industryOptions = [
    { value: "Technologie", label: "Technologie" },
    { value: "Logiciel", label: "Logiciel" },
    { value: "Données", label: "Données" },
    { value: "Web", label: "Web" },
  ];

  const sizeOptions = [
    { value: "TPE", label: "TPE (1-9 employés)" },
    { value: "PME", label: "PME (10-249 employés)" },
    { value: "ETI", label: "ETI (250-4999 employés)" },
    { value: "GE", label: "GE (5000+ employés)" },
  ];

  // Fermer les dropdowns quand on clique ailleurs
  const handleClickOutside = (e) => {
    if (!e.target.closest(".relative")) {
      setOpenDropdowns({});
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Filtres Entreprises
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Filtre Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industries
          </label>
          <MultiSelectDropdown
            field="industries"
            options={industryOptions}
            placeholder="Toutes les industries"
            selectedValues={filters.industries || []}
          />
        </div>

        {/* Filtre Tailles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tailles
          </label>
          <MultiSelectDropdown
            field="sizes"
            options={sizeOptions}
            placeholder="Toutes les tailles"
            selectedValues={filters.sizes || []}
          />
        </div>

        {/* Filtre Villes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Villes
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tapez une ville et appuyez sur Entrée"
            onKeyDown={handleCityKeyPress}
            onBlur={(e) => {
              if (e.target.value) {
                addCity(e.target.value);
                e.target.value = "";
              }
            }}
          />
          {/* Tags des villes sélectionnées */}
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

        <div className="flex items-end">
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {isSearching ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {((filters.industries && filters.industries.length > 0) ||
        (filters.sizes && filters.sizes.length > 0) ||
        (filters.cities && filters.cities.length > 0)) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Filtres actifs:{" "}
              {(filters.industries?.length || 0) +
                (filters.sizes?.length || 0) +
                (filters.cities?.length || 0)}{" "}
              sélection(s)
            </span>
            <button
              onClick={() =>
                onFiltersChange({ industries: [], sizes: [], cities: [] })
              }
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
