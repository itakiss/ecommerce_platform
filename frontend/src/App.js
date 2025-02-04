// Updated App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/navigationBar';
import TopHeader from './components/TopHeader';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CartPage from './pages/Cart';
import FavoritesPage from './pages/Favorites';
import Checkout from './pages/Checkout';
import Profile from './pages/Account';
import MyProfile from './pages/account_routes/MyProfile';
import MyOrders from './pages/account_routes/MyOrders';
import WomensFragrances from './pages/WomensFragrances';
import MensFragrances from './pages/MensFragrances';
import ProductDetails from './pages/ProductDetails';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users/checkSession', { withCredentials: true });
        if (response.data.isLoggedIn) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateFavoritesCount = (newCount) => {
    setFavoritesCount(newCount);
  };

  return (
    <Router>
      <div className="App">
        {user && <TopHeader />}
        <Header user={user} favoritesCount={favoritesCount} updateFavoritesCount={updateFavoritesCount} />
        <Routes>
          <Route path="/" element={<Home updateFavoritesCount={updateFavoritesCount} />}>  
            <Route index element={<HomePage />} />
            <Route path="womens-fragrances" element={<WomensFragrances />} />
            <Route path="mens-fragrances" element={<MensFragrances />} />
          </Route>

          <Route path="/product/:variantId" element={<ProductDetails />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <HomePage />} />
          <Route path="/register" element={<SignUp />} />

          <Route path="/cart" element={<CartPage user={user} />} />
          <Route path="/favorites" element={<FavoritesPage user={user} updateFavoritesCount={updateFavoritesCount} />} />

          <Route path="/profile/*" element={user ? <Profile /> : <HomePage />}> 
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="payment-options" element={<div>Payment Options Content</div>} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="returns" element={<div>Returns Content</div>} />
          </Route>

          <Route path="/checkout/:id" element={user ? <Checkout /> : <HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
