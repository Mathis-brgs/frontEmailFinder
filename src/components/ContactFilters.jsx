import { Search, User } from "lucide-react";

const ContactFilters = ({
  selectedDomain,
  filters,
  onFiltersChange,
  onSearch,
}) => {
  const handleFilterChange = (field, value) => {
    onFiltersChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5" />
        Recherche Contacts - {selectedDomain}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poste recherché
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: CEO, Manager, Director..."
            value={filters.position}
            onChange={(e) => handleFilterChange("position", e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Rechercher Contacts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactFilters;
