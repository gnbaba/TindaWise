import React, { createContext, useState, useEffect } from 'react';
import { ProductStorage } from './ProductStorage';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Load products and transactions from localStorage
  useEffect(() => {
    const loadedProducts = ProductStorage.getProducts();
    const loadedTransactions = ProductStorage.getTransactions();
    setProducts(loadedProducts);
    setTransactions(loadedTransactions);
  }, []);

  // Save products to localStorage
  useEffect(() => {
    if (products.length > 0) {
      ProductStorage.saveProducts(products);
    }
  }, [products]);

  // Save transactions to localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      ProductStorage.saveTransactions(transactions);
    }
  }, [transactions]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      soldQuantity: 0,
      history: []
    };
    setProducts([...products, newProduct]);
  };

  const deleteProducts = (productIds) => {
    setProducts(products.filter(p => !productIds.includes(p.id)));
  };

  const updateProduct = (productId, updates) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, ...updates } : p
    ));
  };

  const restockProduct = (productId, quantity, buyingPrice, sellingPrice) => {
    const now = new Date().toLocaleDateString();
    
    setProducts(products.map(p => {
      if (p.id === productId) {
        // Update product with new quantity and optionally new prices
        const updatedProduct = {
          ...p,
          quantity: parseInt(p.quantity) + quantity,
          buyingPrice: buyingPrice,  // Use new price or keep old
          sellingPrice: sellingPrice, // Use new price or keep old
          history: [
            ...p.history, 
            { 
              date: now, 
              qty: quantity,
              buyingPrice: buyingPrice,
              sellingPrice: sellingPrice
            }
          ]
        };
        return updatedProduct;
      }
      return p;
    }));
  };

  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...transactionData
    };
    setTransactions([...transactions, newTransaction]);
  };

  const sellProducts = (cartItems) => {
    // Decrease product quantities and increase soldQuantity
    const updatedProducts = products.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          quantity: parseInt(product.quantity) - cartItem.quantity,
          soldQuantity: (parseInt(product.soldQuantity || 0) + cartItem.quantity)
        };
      }
      return product;
    });
    setProducts(updatedProducts);

    // Record transaction
    const total = cartItems.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    addTransaction({
      items: cartItems,
      total: total
    });
  };

  return (
    <ProductContext.Provider value={{
      products,
      transactions,
      salesHistory: transactions,
      addProduct,
      deleteProducts,
      updateProduct,
      restockProduct,
      sellProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};