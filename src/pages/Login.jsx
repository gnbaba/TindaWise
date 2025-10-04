import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserManagement';
import './Login.css';
import logo from "../assets/TindaWiseFull.png"

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    // Call login from context
    const result = login(values.email, values.password);
    if (result.success) {
      // Login successful, navigate to home
      navigate('/home');
    } else {
      // Show error message
      setError(result.message);
    }
    // For backend replace above with API call
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <img src={logo} alt="TindaWise Logo" className="logo-img" />
      </div>
      <div className="form-section">
        <div className="form-box">
          <h2>Log in to your account</h2>
          <p>Welcome back!</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChanges}
              required
            />
            
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChanges}
              required
            />
            
            <div className="options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-password">Forgot password</a>
            </div>
            
            <button type="submit" className="login-button">Log in</button>
          </form>
          
          <button className="google-button">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png" alt="Google" className="google-icon" />
            Log in with Google
          </button>
          
          <p className="signup-link">Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;