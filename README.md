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

