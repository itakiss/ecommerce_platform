// SignUp.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import "./SignUp.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      setServerError("");
      return;
    }
    setPasswordError("");

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      console.log('User registered:', response.data);
      alert("Registration successful! Please check your email to verify your account.");
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response && error.response.data) {
        if (error.response.data.error === 'Email already registered') {
          setServerError("This email is already registered. Please use a different email or log in.");
        } else if (error.response.data.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Registration failed. Please try again.");
        }
      } else {
        setServerError("Registration failed. Please try again.");
      }
    }
  };
  return (
    <div className="sign-up">
      <div className="form-container">
        <h2>Create an account</h2>
        <p>Enter your details below</p>
        <form onSubmit={handleSubmit} className="sign-up-form">
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          {serverError && <p className="error-message">{serverError}</p>}
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
        <div className="login-prompt">
          <span>Already have an account?</span>
          <Link to="/login" className="login-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;