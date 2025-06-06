import React, { useState } from "react";

const SirenModal = ({ onClose, onSubmit }) => {
  const [sirenInput, setSirenInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const list = sirenInput
      .split(/[\s,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length === 9 && /^\d+$/.test(s));

    if (list.length === 0) {
      setError("Veuillez entrer au moins un SIREN valide (9 chiffres).");
      return;
    }

    onSubmit(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Ajouter des SIREN
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          placeholder="Entrez les SIREN, séparés par espaces, virgules ou sauts de ligne"
          value={sirenInput}
          onChange={(e) => {
            setSirenInput(e.target.value);
            if (error) setError("");
          }}
          rows={6}
          spellCheck={false}
          aria-label="Entrée des numéros SIREN"
        />
        {error && (
          <p className="text-red-600 mb-3 text-sm text-center">{error}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SirenModal;
