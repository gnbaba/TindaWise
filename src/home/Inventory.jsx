import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductManagement';
import './Inventory.css';

const categories = [
  'Snacks', 'Rice', 'Canned Goods', 'Cooking Condiments', 'Toiletries',
  'Cleaning Supplies', 'Drinks', 'Miscellaneous Goods', 'School Supplies'
];

const Inventory = () => {
  const { products, addProduct, deleteProducts, restockProduct } = useContext(ProductContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', buyingPrice: '', sellingPrice: '', quantity: '',
    threshold: '10', image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: imageUrl });
    }
  };

  const handleAddProduct = () => {
    addProduct(newProduct);
    setShowAddModal(false);
    setNewProduct({
      name: '', category: '', buyingPrice: '', sellingPrice: '', quantity: '',
      threshold: '10', image: null
    });
  };

  const toggleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    deleteProducts(selectedProducts);
    setSelectedProducts([]);
    setShowDeleteModal(false);
  };

  const handleRestock = () => {
    restockProduct(selectedProduct.id, restockQty);
    setShowRestockModal(false);
  };

  const getAvailability = (quantity, threshold) => {
    const q = parseInt(quantity, 10);
    const t = parseInt(threshold, 10);
    if (q === 0) return { text: 'Out of stock', color: 'red' };
    if (q <= t) return { text: 'Low stock', color: 'orange' };
    return { text: 'In-stock', color: 'green' };
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category === filterCategory)
    : products;

  return (
    <div className="inventory">
      <div className="products-section">
        <h3>Products</h3>
        <div className="actions">
          {!selectedProducts.length ? (
            <>
              <button className="add-btn" onClick={() => setShowAddModal(true)}>Add Product</button>
              <button className="delete-btn disabled">Delete Product</button>
              <select className="filter" value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">Filter</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </>
          ) : (
            <>
              <button className="add-btn disabled">Add Product</button>
              <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>Delete Product</button>
              <select className="filter disabled"><option>Filter</option></select>
            </>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Products</th>
              <th>Buying Price</th>
              <th>Selling Price</th>
              <th>Quantity</th>
              <th>Threshold</th>
              <th>Restock</th>
              <th>History</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const avail = getAvailability(product.quantity, product.threshold);
              return (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>₱{product.buyingPrice}</td>
                  <td>₱{product.sellingPrice}</td>
                  <td>{product.quantity}</td>
                  <td>{product.threshold}</td>
                  <td>
                    <button
                      className="restock-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setRestockQty(0);
                        setShowRestockModal(true);
                      }}
                    >
                      Restock
                    </button>
                  </td>
                  <td>
                    <button
                      className="history-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowHistoryModal(true);
                      }}
                    >
                      History
                    </button>
                  </td>
                  <td style={{ color: avail.color }}>{avail.text}</td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr><td colSpan="9">No products added yet.</td></tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button>Previous</button>
          <span>Page 1 of 1</span>
          <button>Next</button>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h2>New Product</h2>
            <div className="image-upload" onDragOver={handleDragOver} onDrop={handleDrop}>
              <p>Drag image here or</p>
              <input type="file" onChange={handleImageChange} accept="image/*" />
              {newProduct.image && <img src={newProduct.image} alt="Preview" />}
            </div>
            <label>Product Name</label>
            <input name="name" value={newProduct.name} onChange={handleInputChange} />
            <label>Category</label>
            <select name="category" value={newProduct.category} onChange={handleInputChange}>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <label>Buying Price</label>
            <input name="buyingPrice" value={newProduct.buyingPrice} onChange={handleInputChange} />
            <label>Selling Price</label>
            <input name="sellingPrice" value={newProduct.sellingPrice} onChange={handleInputChange} />
            <label>Quantity</label>
            <input name="quantity" value={newProduct.quantity} onChange={handleInputChange} />
            <label>Threshold Value</label>
            <input name="threshold" value={newProduct.threshold} onChange={handleInputChange} />
            <div className="modal-buttons">
              <button className="discard" onClick={() => setShowAddModal(false)}>Discard</button>
              <button className="add" onClick={handleAddProduct}>Add Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Caution</h2>
            <p>Are you sure to delete the selected products?</p>
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="confirm" onClick={handleDeleteSelected}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h2>Restock Product</h2>
            <p>Product: <strong>{selectedProduct.name}</strong></p>
            <label>Restock Quantity</label>
            <div className="qty-controls">
              <button onClick={() => setRestockQty(q => Math.max(0, q - 1))}>-</button>
              <input 
                type="number" 
                value={restockQty} 
                onChange={(e) => setRestockQty(Math.max(0, parseInt(e.target.value) || 0))}
                className="qty-input"
                min="0"
              />
              <button onClick={() => setRestockQty(q => q + 1)}>+</button>
            </div>
            <div className="modal-buttons">
              <button className="discard" onClick={() => setShowRestockModal(false)}>Cancel</button>
              <button className="add" onClick={handleRestock}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="add-modal">
            <h2>History</h2>
            <p>Product: <strong>{selectedProduct.name}</strong></p>
            <table style={{ width: '100%', marginTop: '10px' }}>
              <thead>
                <tr><th>Date Restock</th><th>Quantity</th></tr>
              </thead>
              <tbody>
                {selectedProduct.history && selectedProduct.history.length > 0 ? (
                  selectedProduct.history.map((h, i) => (
                    <tr key={i}><td>{h.date}</td><td>{h.qty}</td></tr>
                  ))
                ) : (
                  <tr><td colSpan="2">No history yet</td></tr>
                )}
              </tbody>
            </table>
            <div className="modal-buttons">
              <button className="discard" onClick={() => setShowHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;