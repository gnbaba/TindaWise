import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductManagement';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

const Reports = () => {
  const { products, salesHistory } = useContext(ProductContext);

  const totalPurchaseCost = products.reduce((sum, p) => 
    sum + (parseFloat(p.buyingPrice || 0) * parseInt(p.quantity || 0)), 0
  );
  
  const totalSales = salesHistory?.reduce((sum, sale) => 
    sum + (sale.total || 0), 0
  ) || 0;
  
  const totalProfit = products.reduce((sum, p) => {
  const profitPerUnit = parseFloat(p.sellingPrice || 0) - parseFloat(p.buyingPrice || 0);
  const profit = profitPerUnit * parseInt(p.soldQuantity || 0);
  return sum + profit;
  }, 0);

  const monthlyProfit = totalProfit;

  const salesToday = salesHistory?.filter(sale => {
  const today = new Date();
  const saleDate = new Date(sale.timestamp);
  
  return today.getDate() === saleDate.getDate() &&
         today.getMonth() === saleDate.getMonth() &&
         today.getFullYear() === saleDate.getFullYear();
}).reduce((sum, sale) => sum + sale.total, 0) || 0;

  const yearlyProfit = totalProfit;

  const bestSellingProducts = [...products]
    .map(product => ({
      name: product.name,
      soldQuantity: parseInt(product.soldQuantity || 0),
      category: product.category,
      remainingQuantity: parseInt(product.quantity || 0),
      turnOver: parseFloat(product.sellingPrice || 0) * parseInt(product.soldQuantity || 0),
      increaseBy: (Math.random() * 3).toFixed(1) + '%'
    }))
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 4);

  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { turnOver: 0, count: 0 };
    }
    const turnOver = parseFloat(product.sellingPrice || 0) * parseInt(product.soldQuantity || 0);
    acc[category].turnOver += turnOver;
    acc[category].count += 1;
    return acc;
  }, {});

  const bestSellingCategories = Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      turnOver: data.turnOver,
      increaseBy: (Math.random() * 5).toFixed(1) + '%'
    }))
    .sort((a, b) => b.turnOver - a.turnOver)
    .slice(0, 4);

  const profitRevenueData = [
    { month: 'Jan', revenue: 20000, profit: 18000 },
    { month: 'Feb', revenue: 28000, profit: 25000 },
    { month: 'Mar', revenue: 32000, profit: 28000 },
    { month: 'Apr', revenue: 35000, profit: 30000 },
    { month: 'May', revenue: 40000, profit: 35000 },
    { month: 'Jun', revenue: 45000, profit: 38000 },
    { month: 'Jul', revenue: 52000, profit: 45000 },
    { month: 'Aug', revenue: 58000, profit: 50000 },
    { month: 'Sep', revenue: 62000, profit: 55000 },
    { month: 'Oct', revenue: 65000, profit: 58000 },
    { month: 'Nov', revenue: 70000, profit: 62000 },
    { month: 'Dec', revenue: 60000, profit: 52000 }
  ];

  const lowStockProducts = products
    .filter(p => parseInt(p.quantity || 0) < parseInt(p.threshold || 10))
    .map(p => ({
      name: p.name,
      image: p.image,
      remainingQuantity: parseInt(p.quantity || 0),
      status: 'Low'
    }));

  return (
    <div className="overview-dashboard">
      <div className="dashboard-layout">
        <div className="left-column">
          <div className="overview-section">
            <h3 className="section-title">Overview</h3>
            <div className="overview-cards">
              <div className="overview-card">
                <div className="card-value">₱{totalPurchaseCost.toLocaleString()}</div>
                <div className="card-label">Total Purchase Cost</div>
              </div>
              <div className="overview-card">
                <div className="card-value">₱{totalSales.toLocaleString()}</div>
                <div className="card-label">Total Sales</div>
              </div>
              <div className="overview-card">
                <div className="card-value">₱{salesToday.toLocaleString()}</div>
                <div className="card-label">Sales Today</div>
              </div>
            </div>
            <div className="overview-cards-row2">
              <div className="overview-card">
                <div className="card-value">₱{monthlyProfit.toLocaleString()}</div>
                <div className="card-label">Monthly Profit</div>
              </div>
              <div className="overview-card">
                <div className="card-value">₱{yearlyProfit.toLocaleString()}</div>
                <div className="card-label">Yearly Profit</div>
              </div>
            </div>
          </div>

          <div className="card chart-card">
            <h3 className="card-title">Profit & Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3F7F5A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" stroke="#6BBF8A" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card best-product-card">
            <h3 className="card-title">Best selling product</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold Quantity</th>
                  <th>Category</th>
                  <th>Remaining Quantity</th>
                  <th>Turn Over</th>
                  <th>Increase By</th>
                </tr>
              </thead>
              <tbody>
                {bestSellingProducts.length > 0 ? (
                  bestSellingProducts.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product.name}</td>
                      <td>{product.soldQuantity}</td>
                      <td>{product.category}</td>
                      <td>{product.remainingQuantity}</td>
                      <td>₱{product.turnOver.toLocaleString()}</td>
                      <td className="increase-text">{product.increaseBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card best-product-card">
            <h3 className="card-title">Best selling category</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Turn Over</th>
                  <th>Increase By</th>
                </tr>
              </thead>
              <tbody>
                {bestSellingCategories.length > 0 ? (
                  bestSellingCategories.map((cat, idx) => (
                    <tr key={`category-${idx}`}>
                      <td>{cat.category}</td>
                      <td>₱{cat.turnOver.toLocaleString()}</td>
                      <td className="increase-text">{cat.increaseBy}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                      No category data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-column">
          <div className="card low-stock-card">
            <h3 className="card-title">Low Quantity Stock</h3>
            <div className="stock-items">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((item, idx) => (
                  <div key={idx} className="stock-item">
                    <div className="stock-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="placeholder-image">📦</div>
                      )}
                    </div>
                    <div className="stock-item-info">
                      <div className="stock-item-name">{item.name}</div>
                      <div className="stock-item-qty">Remaining Quantity: {item.remainingQuantity}</div>
                    </div>
                    <span className="status-badge low">{item.status}</span>
                  </div>
                ))
              ) : (
                <div className="no-stock-message">No low stock items</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;