// src/services/dataService.js

const STORAGE_KEY = 'agromarket_data';

// Structure initiale : tout est vide
const defaultData = {
  users: [],
  products: [],
  orders: [],
  certifications: [],
  reports: [],
  subscriptions: [],
  notifications: [],
};

// Charger les données depuis localStorage, ou créer la structure vide
const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { ...defaultData };
    }
  }
  return { ...defaultData };
};

// Sauvegarder toutes les données
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// === Service CRUD générique ===
const dataService = {
  // Récupérer toute la base
  getAll: () => loadData(),

  // Récupérer une collection
  getCollection: (collectionName) => {
    const data = loadData();
    return data[collectionName] || [];
  },

  // Ajouter un élément à une collection
  add: (collectionName, item) => {
    const data = loadData();
    if (!data[collectionName]) data[collectionName] = [];
    // Générer un ID simple
    const maxId = data[collectionName].reduce((max, cur) => (cur.id > max ? cur.id : max), 0);
    const newItem = { ...item, id: maxId + 1 };
    data[collectionName].push(newItem);
    saveData(data);
    return newItem;
  },

  // Mettre à jour un élément par son id
  update: (collectionName, id, updates) => {
    const data = loadData();
    const collection = data[collectionName];
    if (!collection) return null;
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...updates };
    saveData(data);
    return collection[index];
  },

  // Supprimer un élément
  remove: (collectionName, id) => {
    const data = loadData();
    const collection = data[collectionName];
    if (!collection) return false;
    data[collectionName] = collection.filter(item => item.id !== id);
    saveData(data);
    return true;
  },

  // Trouver un élément par id
  findById: (collectionName, id) => {
    const data = loadData();
    const collection = data[collectionName];
    if (!collection) return null;
    return collection.find(item => item.id === id) || null;
  },

  // Vider toutes les données (pour réinitialiser)
  clearAll: () => {
    saveData({ ...defaultData });
  },
};

export default dataService;