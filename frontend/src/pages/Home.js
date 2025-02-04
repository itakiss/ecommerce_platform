// Home.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Home.css';

const categories = {
  "Women's Fragrances": "/womens-fragrances",
  "Men's Fragrances": "/mens-fragrances",
};

const Home = ({ updateFavoritesCount }) => {
  return (
    <div className="Home">
      <div className="SideMenu">
        {Object.keys(categories).map((category) => (
          <div key={category} className="Category">
            <NavLink
              to={categories[category]}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <div className="text-wrapper7">{category}</div>
            </NavLink>
          </div>
        ))}
      </div>

      <div className="home-main-frame">
        <Outlet context={{ updateFavoritesCount }} />
      </div>
    </div>
  );
};

export default Home;
