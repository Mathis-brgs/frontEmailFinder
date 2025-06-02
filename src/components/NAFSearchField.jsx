// NAFSearchField.jsx
import { useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

const NAFSearchField = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef(null);

  // Fonction de recherche NAF
  const searchNaf = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/naf/search-naf?q=${encodeURIComponent(
          searchTerm.trim()
        )}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
        setHasSearched(true);
      } else {
        console.error("Erreur lors de la recherche NAF");
        setResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche NAF:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      // Réinitialiser si l'utilisateur efface
      if (hasSearched && value.length === 0) {
        setResults([]);
        setShowResults(false);
        setHasSearched(false);
      }
    },
    [hasSearched]
  );

  const handleKeyPress = useCallback(
    (e) => {
      const trimmedValue = searchTerm.trim();

      if (e.key === "Enter" && trimmedValue.length >= 2) {
        e.preventDefault();
        searchNaf(trimmedValue);

        if (e.key === " " && !trimmedValue.endsWith(" ")) {
          setSearchTerm(trimmedValue + " ");
        }
      }
    },
    [searchTerm, searchNaf]
  );

  const handleBlur = useCallback(() => {
    const trimmedValue = searchTerm.trim();
    if (!hasSearched && trimmedValue.length >= 2) {
      searchNaf(trimmedValue);
    }
  }, [searchTerm, hasSearched, searchNaf]);

  const addNafItem = useCallback(
    (nafItem) => {
      const currentNaf = filters.naf_sous_classes || [];
      const isAlreadySelected = currentNaf.some(
        (item) => item.code === nafItem.code
      );

      if (!isAlreadySelected) {
        const newNaf = [...currentNaf, nafItem];
        onFilterChange("naf_sous_classes", newNaf);
      }

      // Réinitialiser la recherche
      setSearchTerm("");
      setShowResults(false);
      setResults([]);
      setHasSearched(false);

      // Remettre le focus
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    },
    [filters.naf_sous_classes, onFilterChange]
  );

  const removeNafItem = useCallback(
    (nafItem) => {
      const currentNaf = filters.naf_sous_classes || [];
      const newNaf = currentNaf.filter((item) => item.code !== nafItem.code);
      onFilterChange("naf_sous_classes", newNaf);
    },
    [filters.naf_sous_classes, onFilterChange]
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Activités (NAF)
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: culture (appuyez Entrée pour chercher)"
          autoComplete="off"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Indication pour l'utilisateur */}
      {searchTerm.trim().length >= 2 && !hasSearched && !isSearching}

      {/* Résultats de recherche */}
      {showResults && results.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((nafItem) => (
            <button
              key={nafItem.code}
              onClick={() => addNafItem(nafItem)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm text-gray-900">
                {nafItem.libelle}
              </div>
              <div className="text-xs text-gray-500">Code: {nafItem.code}</div>
            </button>
          ))}
        </div>
      )}

      {/* Message si aucun résultat */}
      {showResults && results.length === 0 && hasSearched && !isSearching && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-center text-gray-500 text-sm">
          Aucun résultat trouvé pour "{searchTerm.trim()}"
        </div>
      )}

      {/* Tags des NAF sélectionnées */}
      {filters.naf_sous_classes && filters.naf_sous_classes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {filters.naf_sous_classes.map((nafItem) => (
            <span
              key={nafItem.code}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {nafItem.libelle}
              <button
                onClick={() => removeNafItem(nafItem)}
                className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-green-500 hover:bg-green-200"
              >
                <X className="h-2 w-2" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NAFSearchField;
