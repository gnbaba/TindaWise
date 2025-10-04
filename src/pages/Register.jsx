import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserManagement';
import './Register.css';
import logo from "../assets/TindaWiseFull.png"

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(UserContext);
  
  const [values, setValues] = useState({
    username: '',
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
    
    // Basic validation
    if (values.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }  
    // Call register from context
    const newUser = register(values); 
    if (newUser) {
      // Registration successful, navigate to home
      navigate('/home');
    } 
    // For backend replace above with API call
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
          
          {error && <div className="error-message">{error}</div>}
          
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