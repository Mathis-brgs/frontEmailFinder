import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL;

const PosteSearchField = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const debounceTimeout = useRef(null);
  const dropdownRef = useRef(null);

  const toggleTitleItem = useCallback(
    (titre) => {
      const currentTitles = filters.titles || [];
      const titleExists = currentTitles.includes(titre);

      if (titleExists) {
        onFilterChange((prev) => ({
          ...prev,
          titles: currentTitles.filter((title) => title !== titre),
        }));
      } else {
        onFilterChange((prev) => ({
          ...prev,
          titles: [...currentTitles, titre],
        }));
      }
    },
    [filters.titles, onFilterChange]
  );

  const searchPostes = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setSearchError("");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `${API_URL}/api/titles/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche de titres:", error);
      setSearchError("Erreur lors de la recherche. Veuillez réessayer.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        searchPostes(searchTerm);
      } else if (searchTerm.trim().length === 0) {
        setResults([]);
        setHasSearched(false);
        setSearchError("");
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, searchPostes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clearAllTitles = () => {
    onFilterChange((prev) => ({
      ...prev,
      titles: [],
    }));
  };

  const selectedTitles = filters.titles || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sélectionner des postes
      </label>

      {/* Bouton principal du dropdown */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span className="text-gray-700">
          {selectedTitles.length > 0
            ? `${selectedTitles.length} poste(s) sélectionné(s)`
            : "Sélectionner des postes..."}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {/* Dropdown ouvert */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Champ de recherche dans le dropdown */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un poste..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Messages d'erreur */}
          {searchError && (
            <div className="p-3 bg-red-50 border-b border-red-200 text-sm text-red-600">
              {searchError}
            </div>
          )}

          {/* Liste des résultats avec checkboxes */}
          <div className="max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((titre, index) => {
                const isSelected = selectedTitles.includes(titre);
                return (
                  <label
                    key={index}
                    className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTitleItem(titre)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900 flex-1">
                      {titre}
                    </span>
                  </label>
                );
              })
            ) : hasSearched && searchTerm.trim().length >= 2 ? (
              <div className="px-3 py-4 text-gray-500 text-center text-sm">
                Aucun poste trouvé pour "{searchTerm}"
              </div>
            ) : searchTerm.trim().length < 2 ? (
              <div className="px-3 py-4 text-gray-500 text-center text-sm">
                Tapez au moins 2 caractères pour rechercher
              </div>
            ) : null}
          </div>

          {/* Actions du dropdown */}
          {selectedTitles.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={clearAllTitles}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Tout déselectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PosteSearchField;
