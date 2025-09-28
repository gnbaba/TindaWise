import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Register.css';
import logo from "../assets/TindaWiseFull.png"


const Register = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register form submitted with:', values);
  };

  return (
    <div className="register-container">
      <div className="logo-section">
        <img src={logo} alt="TindaWise Logo" className="logo-img" />
      </div>
      <div className="form-section">
        <div className="form-box">

          <h2>Create an Account</h2>
          <p>Start creating smart business decisions!</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Name</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your name"
              value={values.username}
              onChange={handleChanges}
              required
            />
            
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
              placeholder="Create a password"
              value={values.password}
              onChange={handleChanges}
              required
            />
            
            <button type="submit" className="register-button">Sign up</button>
          </form>
          <button className="google-button">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_64dp.png" alt="Google" className="google-icon" />
            Sign up with Google
          </button>
          <p className="login-link">Already have an account? <Link to="/login">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;