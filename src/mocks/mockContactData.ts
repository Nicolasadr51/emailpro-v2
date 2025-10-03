import { Contact, ContactList, CreateContactRequest, UpdateContactRequest, ContactFilters, ContactListFilters, ContactListResponse, ContactListsResponse, CreateContactListRequest, UpdateContactListRequest } from "../types/contact";

const generateRandomId = () => `mock-${Math.random().toString(36).substr(2, 9)}`;

const mockContacts: Contact[] = [
  {
    id: generateRandomId(),
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    status: "subscribed",
    createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-15T10:00:00Z").toISOString(),
    tags: ["client", "premium"],
    customFields: { city: "Paris" },
    listIds: ["list-1", "list-2"],
    stats: {
      emailsSent: 10,
      emailsOpened: 5,
      emailsClicked: 2,
      lastOpenedAt: new Date("2024-01-20T10:00:00Z").toISOString(),
      lastClickedAt: new Date("2024-01-22T10:00:00Z").toISOString(),
    },
    preferences: {
      language: "fr",
      timezone: "Europe/Paris",
      emailFormat: "html",
    },
  },
  {
    id: generateRandomId(),
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    status: "subscribed",
    createdAt: new Date("2024-02-20T11:30:00Z").toISOString(),
    updatedAt: new Date("2024-02-20T11:30:00Z").toISOString(),
    tags: ["lead"],
    customFields: { country: "France" },
    listIds: ["list-1"],
    stats: {
      emailsSent: 5,
      emailsOpened: 3,
      emailsClicked: 1,
      lastOpenedAt: new Date("2024-02-25T11:30:00Z").toISOString(),
      lastClickedAt: new Date("2024-02-26T11:30:00Z").toISOString(),
    },
    preferences: {
      language: "en",
      timezone: "America/New_York",
      emailFormat: "html",
    },
  },
  {
    id: generateRandomId(),
    email: "peter.jones@example.com",
    firstName: "Peter",
    lastName: "Jones",
    status: "unsubscribed",
    createdAt: new Date("2024-03-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2024-03-01T09:00:00Z").toISOString(),
    tags: [],
    customFields: {},
    listIds: ["list-2"],
    stats: {
      emailsSent: 2,
      emailsOpened: 0,
      emailsClicked: 0,
    },
    preferences: {
      language: "en",
      timezone: "Europe/London",
      emailFormat: "text",
    },
  },
];

const mockContactLists: ContactList[] = [
  {
    id: "list-1",
    name: "Clients Premium",
    description: "Liste des clients ayant un abonnement premium.",
    contactCount: 2,
    createdAt: new Date("2024-01-01T08:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T08:00:00Z").toISOString(),
    isDefault: false,
    tags: ["premium", "client"],
  },
  {
    id: "list-2",
    name: "Leads du site web",
    description: "Contacts collectés via le formulaire du site web.",
    contactCount: 2,
    createdAt: new Date("2024-01-10T14:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-10T14:00:00Z").toISOString(),
    isDefault: true,
    tags: ["lead", "website"],
  },
];

export const mockContactData = {
  contacts: mockContacts,
  contactLists: mockContactLists,

  getContacts(filters: ContactFilters = {}, page: number = 1, limit: number = 10): ContactListResponse {
    let filteredContacts = this.contacts;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredContacts = filteredContacts.filter(
        (c) =>
          c.email.toLowerCase().includes(searchTerm) ||
          c.firstName?.toLowerCase().includes(searchTerm) ||
          c.lastName?.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      filteredContacts = filteredContacts.filter((c) => statuses.includes(c.status));
    }
    if (filters.listIds && filters.listIds.length > 0) {
      filteredContacts = filteredContacts.filter((c) => c.listIds?.some(id => filters.listIds!.includes(id)));
    }

    const total = filteredContacts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    return {
      data: paginatedContacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      hasMore: endIndex < total,
    };
  },

  getContact(id: string): Contact {
    const contact = this.contacts.find((c) => c.id === id);
    if (!contact) {
      throw new Error("Contact non trouvé");
    }
    return contact;
  },

  createContact(data: CreateContactRequest): Contact {
    const newContact: Contact = {
      id: generateRandomId(),
      ...data,
      status: data.status || "subscribed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
      customFields: data.customFields || {},
      listIds: data.listIds || [],
      stats: {
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
      },
      preferences: {
        language: data.preferences?.language || "en",
        timezone: data.preferences?.timezone || "UTC",
        emailFormat: data.preferences?.emailFormat || "html",
      },
    };
    this.contacts.push(newContact);
    return newContact;
  },

  updateContact(id: string, data: UpdateContactRequest): Contact {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Contact non trouvé");
    }
    this.contacts[index] = { ...this.contacts[index], ...data, updatedAt: new Date().toISOString() };
    return this.contacts[index];
  },

  deleteContact(id: string): void {
    const index = this.contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Contact non trouvé");
    }
    this.contacts.splice(index, 1);
  },

  getContactLists(filters: ContactListFilters = {}, page: number = 1, limit: number = 10): ContactListsResponse {
    let filteredLists = this.contactLists;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredLists = filteredLists.filter((list) => list.name.toLowerCase().includes(searchTerm));
    }

    const total = filteredLists.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLists = filteredLists.slice(startIndex, endIndex);

    return {
      data: paginatedLists,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      hasMore: endIndex < total,
    };
  },

  getContactList(id: string): ContactList {
    const list = this.contactLists.find((l) => l.id === id);
    if (!list) {
      throw new Error("Liste de contacts non trouvée");
    }
    return list;
  },

  createContactList(data: CreateContactListRequest): ContactList {
    const newList: ContactList = {
      id: generateRandomId(),
      name: data.name,
      description: data.description || "",
      contactCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false, // Default value
      tags: data.tags || [],
    };
    this.contactLists.push(newList);
    return newList;
  },

  updateContactList(id: string, data: UpdateContactListRequest): ContactList {
    const index = this.contactLists.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error("Liste de contacts non trouvée");
    }
    this.contactLists[index] = { ...this.contactLists[index], ...data, updatedAt: new Date().toISOString() };
    return this.contactLists[index];
  },

  deleteContactList(id: string): void {
    const index = this.contactLists.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error("Liste de contacts non trouvée");
    }
    this.contactLists.splice(index, 1);
  },
};
