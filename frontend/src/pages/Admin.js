//frontend/src/pages/Admin.js
import React from 'react';

const Admin = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Manage your products and orders here.</p>
      <a href="/admin/products" className="admin-link">Manage Products</a>
    </div>
  );
};

export default Admin;
