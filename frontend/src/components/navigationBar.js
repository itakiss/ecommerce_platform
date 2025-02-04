import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navigationBar.css';
import useCountSocket from './useCountSocket.js';
import useFetchCount from './useFetchCount.js';

const Header = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const userId = user?.id;

  useCountSocket(userId, 'cartUpdated', setCartCount);
  useCountSocket(userId, 'favoritesUpdated', setFavoritesCount);

  useFetchCount(user, 'cart', setCartCount, cartCount);
  useFetchCount(user, 'favorites', setFavoritesCount, favoritesCount);
  

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/users/logout', {}, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="frame-4">
          <div className="logo">
            <div className="text-wrapper-4">COMPANY NAME</div>
          </div>
          <div className="frame-5">
            <Link to="/" className="text-wrapper-5">Home</Link>
            <Link to="/contact" className="text-wrapper-5">Contact</Link>
            <Link to="/about" className="text-wrapper-5">About</Link>
            {!user ? (
              <>
                <Link to="/register" className="text-wrapper-6">Sign Up</Link>
                <Link to="/login" className="text-wrapper-6">Login</Link>
              </>
            ) : (
<a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="text-wrapper-6">
  Logout
</a>


            )}
          </div>
          {!location.pathname.includes('login') && !location.pathname.includes('register') && (
            <div className="search-component-set-wrapper">
              <div className="frame-77">
                <div className="div1" onClick={() => navigate('/favorites')}>
                  <div className="icon-container">
                    <img src="/assets/Wishlist.svg" alt="Favorites" className="wishlist-icon" />
                    {favoritesCount > 0 && (
                      <div className="red-dot">
                        <span className="red-dot-number">{favoritesCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="div1" onClick={() => navigate('/cart')}>
                  <div className="icon-container">
                    <img src="/assets/Cart1.svg" alt="Cart" className="cart-icon" />
                    {cartCount > 0 && (
                      <div className="red-dot">
                        <span className="red-dot-number">{cartCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                {user && (
                  <div className="div1 user-icon" onClick={() => navigate('/profile')}>
                    <img src="/assets/user.jpg" alt="User" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default Header;
