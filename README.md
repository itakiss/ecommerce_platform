# 🛒 E-Commerce Platform  

This is a **full-stack eCommerce web application** that enables users to:  
✔️ **Browse products**  
✔️ **Add items to the cart & checkout**  
✔️ **Manage orders & track purchases**  
✔️ **Utilize user authentication & email verification**  

The platform features **product filtering, wishlist functionality, and order management**.  

---

## 🚀 Technologies Used  

### **Backend**  
- **Node.js & Express.js** – Handles server-side logic & API routes  
- **PostgreSQL** – Stores product, user, and order data  
- **bcrypt** – Secure password hashing for authentication  
- **nodemailer** – Sends email verification & order confirmations  
- **crypto** – Generates secure verification tokens  

### **Frontend**  
- **React.js** – Provides a modern, dynamic user interface  
- **React Router** – Manages client-side routing  
- **Axios** – Handles API requests efficiently  
- **CSS Modules** – Ensures modular and maintainable styling  

---

## 🌟 Features  

### **User Features**  
✔️ User **registration, login, and email verification**  
✔️ **Secure password storage** with bcrypt  
✔️ **Shopping cart** with real-time updates  
✔️ **Order checkout** with billing & shipping details  
✔️ **Wishlist / Favorites system**  

### **Product & Order Management**  
✔️ Fetch **products with images, categories & pricing**  
✔️ Implement **dynamic filters** (gender)  
✔️ Allow users to **place orders & track them**  
✔️ Manage cart **quantity updates & view order subtotal**  

### **Admin Features (Upcoming 🚧)**  
🚀 **Admin dashboard** for managing products & orders  
⭐ **User reviews** system for better customer engagement  
📦 **Enhanced order tracking** & improved backend relations  

---

## 🔧 Areas for Improvement  

🎨 **UI/UX Enhancements** – Improve design for a more user-friendly experience  
🔎 **Advanced Filtering** – Implement **price range, brand, bottle size, category, & rating-based filters**  
⭐ **User Reviews** – Allow customers to **leave feedback & rate products**  
📦 **Order Details Page** – Add **clickable orders** for users to **view details**  
👨‍💻 **Admin Panel** – Dashboard for managing **orders, products, & users**  
🗄️ **Database Optimization** – Refine **table relationships** for **better performance**  

---

## 📜 How to Run Locally  

### **1️⃣ Clone the repository**  
```sh
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform
```

### **2️⃣ Install dependencies**
```sh
npm install
```  

### **3️⃣ Set up environment variables**
# Create a .env file in the root directory and add:
```sh
DATABASE_URL=your_postgresql_url  
EMAIL=your_email  
EMAIL_PASSWORD=your_email_password  
SESSION_SECRET=your_secret_key
``` 

### **4️⃣ Start the backend server**
```sh
npm run server
```    
By default, the backend runs on http://localhost:3000/  

### **5️⃣ Start the frontend**
```sh    
npm start
```
The frontend will be available at http://localhost:5173/ (or another port depending on your setup)  

# 🛒 E-Commerce Database  

This repository also contains the **PostgreSQL database schema** for the **E-Commerce Web Application**. The database is designed to support:  

- ✅ **User authentication and account management**  
- ✅ **Product catalog with categories, brands, and variants**  
- ✅ **Shopping cart and order management system**  
- ✅ **Wishlist (Favorites) functionality**  
- ✅ **Order tracking and checkout process**  

---

## 📂 Database Schema Overview  

The database is structured into multiple **normalized tables**, ensuring **data consistency, integrity, and efficient querying**.  

### **Key Tables & Relationships**  
- **`users`** – Stores user details, hashed passwords, and verification status.  
- **`products`** – Contains product details, including name, description, and category.  
- **`product_variants`** – Each product can have multiple variants (e.g., different sizes, colors, prices).  
- **`categories`** – Product categories for easier filtering.  
- **`brands`** – Stores brand names linked to products.  
- **`cart_items`** – Tracks user shopping carts with product variants and quantities.  
- **`orders`** – Stores completed purchases, linked to users and payment details.  
- **`order_items`** – Links specific products to orders, supporting multiple items per order.  
- **`favorites`** – Allows users to save products to their wishlist.  
- **`verification_tokens`** – Manages email verification and password reset tokens.  

---

## 🚀 Features & Best Practices  

- 🔹 **PostgreSQL** as the primary relational database for scalable and secure storage.  
- 🔹 **Foreign keys** enforce referential integrity between users, orders, and products.  
- 🔹 **Indexes on frequently queried fields** to optimize performance.  
- 🔹 **Constraints (`NOT NULL`, `UNIQUE`, `CHECK`)** to prevent invalid data entries.  
- 🔹 **Cascade delete & update rules** for proper relationship management.  
- 🔹 **Transactional integrity** ensures data consistency in complex operations (e.g., checkout process).  

---

## ⚡ Areas for Improvement & Future Enhancements  

- 🛠 **Improve indexing strategy** for better query performance on large datasets.  
- 🛠 **Add soft deletes** (`is_deleted` flag) instead of hard deletes for better data recovery.  
- 🛠 **Implement audit logging** to track user activity, order history, and modifications.  
- 🛠 **Optimize cart expiration logic** (e.g., auto-clear abandoned carts after a period).  
- 🛠 **Enhance user roles & permissions** for admin, customer support, and standard users.  
- 🛠 **Considering database partitioning** if dealing with a large volume of orders/products.  

