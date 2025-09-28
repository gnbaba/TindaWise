import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Login.css';
import logo from "../assets/TindaWiseFull.png"

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for backend integration (e.g., API call with values.email and values.password)
    console.log('Login form submitted with:', values);
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