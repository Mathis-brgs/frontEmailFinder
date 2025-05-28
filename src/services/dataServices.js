// Service pour gérer les données - prêt pour migration vers base de données

class DataService {
  constructor() {
    this.useDatabase = false; // Toggle pour passer en mode DB plus tard
    this.apiBaseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  }

  // Companies
  async getCompanies(filters = {}) {
    if (this.useDatabase) {
      return this.getCompaniesFromDB(filters);
    }
    return this.getCompaniesFromJSON(filters);
  }

  async getCompaniesFromJSON(filters) {
    try {
      const response = await fetch("/data/companies.json");
      const data = await response.json();

      return this.filterCompanies(data.companies, filters);
    } catch (error) {
      console.error("Erreur lors du chargement des entreprises:", error);
      return [];
    }
  }

  async getCompaniesFromDB(filters) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.industries?.length) {
        queryParams.append("industries", filters.industries.join(","));
      }
      if (filters.sizes?.length) {
        queryParams.append("sizes", filters.sizes.join(","));
      }
      if (filters.cities?.length) {
        queryParams.append("cities", filters.cities.join(","));
      }

      const response = await fetch(
        `${this.apiBaseUrl}/companies?${queryParams}`
      );
      const data = await response.json();

      return data.companies || [];
    } catch (error) {
      console.error("Erreur API entreprises:", error);
      return [];
    }
  }

  filterCompanies(companies, filters) {
    return companies.filter((company) => {
      const matchesIndustry =
        !filters.industries?.length ||
        filters.industries.some((industry) =>
          company.industry.toLowerCase().includes(industry.toLowerCase())
        );

      const matchesSize =
        !filters.sizes?.length || filters.sizes.includes(company.size);

      const matchesCity =
        !filters.cities?.length ||
        filters.cities.some((city) =>
          company.city.toLowerCase().includes(city.toLowerCase())
        );

      return matchesIndustry && matchesSize && matchesCity;
    });
  }

  // Contacts
  async getContacts(domain, filters = {}) {
    if (this.useDatabase) {
      return this.getContactsFromDB(domain, filters);
    }
    return this.getContactsFromJSON(domain, filters);
  }

  async getContactsFromJSON(domain, filters) {
    try {
      const response = await fetch("/data/contacts.json");
      const data = await response.json();

      let contacts = data.contacts.filter(
        (contact) => contact.domain === domain
      );

      if (filters.position) {
        contacts = contacts.filter((contact) =>
          contact.position
            .toLowerCase()
            .includes(filters.position.toLowerCase())
        );
      }

      return contacts;
    } catch (error) {
      console.error("Erreur lors du chargement des contacts:", error);
      return [];
    }
  }

  async getContactsFromDB(domain, filters) {
    try {
      const queryParams = new URLSearchParams({ domain });

      if (filters.position) {
        queryParams.append("position", filters.position);
      }

      const response = await fetch(
        `${this.apiBaseUrl}/contacts?${queryParams}`
      );
      const data = await response.json();

      return data.contacts || [];
    } catch (error) {
      console.error("Erreur API contacts:", error);
      return [];
    }
  }

  // Méthode pour basculer vers la base de données
  enableDatabase(enable = true) {
    this.useDatabase = enable;
  }

  // Méthodes pour les futures fonctionnalités DB
  async createCompany(companyData) {
    if (!this.useDatabase) {
      console.warn("Mode JSON - Création d'entreprise non supportée");
      return null;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur création entreprise:", error);
      return null;
    }
  }

  async updateCompany(id, updates) {
    if (!this.useDatabase) {
      console.warn("Mode JSON - Mise à jour d'entreprise non supportée");
      return null;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur mise à jour entreprise:", error);
      return null;
    }
  }
}

export const dataService = new DataService();
export default dataService;
