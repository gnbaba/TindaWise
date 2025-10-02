import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductManagement';
import './Dashboardpage.css';

const categories = [
  'Snacks', 'Rice', 'Canned Goods', 'Cooking Condiments', 'Toiletries',
  'Cleaning Supplies', 'Drinks', 'Miscellaneous Goods', 'School Supplies'
];

const Dashboardpage = () => {
  const { products, sellProducts } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const addToCart = (product) => {
    const availableQty = parseInt(product.quantity);
    const cartItem = cart.find(item => item.id === product.id);
    const qtyInCart = cartItem ? cartItem.quantity : 0;

    if (qtyInCart < availableQty) {
      if (cartItem) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, {
          id: product.id,
          name: product.name,
          image: product.image,
          sellingPrice: parseFloat(product.sellingPrice),
          quantity: 1
        }]);
      }
    }
  };

  const removeFromCart = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  const getAvailableQuantity = (productId) => {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    const qtyInCart = cartItem ? cartItem.quantity : 0;
    return parseInt(product.quantity) - qtyInCart;
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length > 0) {
      sellProducts(cart);
      setCart([]);
      setShowSuccessModal(true);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="dashboard">
      {/* Left Panel - Products */}
      <div className="products-panel">
        <div className="category-filter">
          <h3>Categories</h3>
          <select value={selectedCategory} onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}>
            <option value="">All Products</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="products-list">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map(product => {
                const availableQty = getAvailableQuantity(product.id);
                const isOutOfStock = availableQty === 0;
                
                return (
                  <tr key={product.id} className={isOutOfStock ? 'out-of-stock' : ''}>
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <div className="placeholder-image">📦</div>
                          )}
                        </div>
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-price">₱ {product.sellingPrice}</div>
                        </div>
                      </div>
                    </td>
                    <td>{availableQty}</td>
                    <td>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })}
              {currentProducts.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button 
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button 
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right Panel - Checkout */}
      <div className="checkout-panel">
        <h3>Checkout</h3>
        
        <div className="cart-items">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="cart-product-info">
                      <div className="cart-product-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="placeholder-image">📦</div>
                        )}
                      </div>
                      <div>
                        <div className="cart-product-name">{item.name}</div>
                        <div className="cart-product-price">₱ {item.sellingPrice}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="qty-control">
                      <button onClick={() => removeFromCart(item.id)}>−</button>
                      <span>{item.quantity}</span>
                    </div>
                  </td>
                  <td>₱ {(item.sellingPrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    Cart is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="cart-total-section">
          <h3>Cart Total</h3>
          <div className="total-amount">
            <span>Total:</span>
            <span>₱ {cartTotal.toFixed(2)}</span>
          </div>
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Proceed to checkout
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <h2>Transaction successful!</h2>
            <div className="modal-buttons">
              <button className="ok-btn" onClick={() => setShowSuccessModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboardpage;