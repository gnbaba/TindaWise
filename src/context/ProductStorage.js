const PRODUCTS_KEY = 'pos_products';
const TRANSACTIONS_KEY = 'pos_transactions';

export const ProductStorage = {
  // Products
  getProducts: () => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveProducts: (products) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  // Transactions
  getTransactions: () => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveTransactions: (transactions) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

};