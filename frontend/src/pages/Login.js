import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/users/login', { email, password });
            onLogin(response.data);
            navigate('/');
        } catch (err) {
            setError('Invalid login credentials');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Log in to Exclusive</h2>
            <p className="login-subtitle">Enter your details below</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="input-field"
                    required
                />
                <button type="submit" className="login-button">Log In</button>
                <a href="/forgot-password" className="forgot-password-link">Forget Password?</a>
            </form>
        </div>
    );
};

export default Login;
