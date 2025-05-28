import { useState } from "react";
import dataService from "../services/dataServices";

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCompanies = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const results = await dataService.getCompanies(filters);
      setCompanies(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyEmails = (domain, emailData) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.domain === domain ? { ...company, ...emailData } : company
      )
    );
  };

  return {
    companies,
    loading,
    error,
    searchCompanies,
    updateCompanyEmails,
    setCompanies,
  };
};

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchContacts = async (domain, filters) => {
    setLoading(true);
    setError(null);

    try {
      const results = await dataService.getContacts(domain, filters);
      setContacts(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    error,
    searchContacts,
    setContacts,
  };
};
