import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Account.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <ul>
            <li>
              <NavLink 
                to="my-profile" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Profile
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="payment-options" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Payment Options
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="my-orders" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Orders
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="returns" 
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Returns
              </NavLink>
            </li>
          </ul>
        </aside>
        <main className="profile-content">
          {/* Renders the active sub-route content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Profile;
