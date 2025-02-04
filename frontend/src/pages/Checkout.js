import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkout.css';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    paymentMethod: "cod",
    preferred_billing: false,
  });

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = window.location.pathname.split("/").pop();
        const response = await axios.get(`http://localhost:3000/api/orders/${orderId}`, { withCredentials: true });

        if (!response.data || response.data.order_status !== "Draft") {
          navigate("/cart"); // Redirect if the draft order no longer exists
        }
      } catch (error) {
        navigate("/cart"); // Redirect on error
      }
    };
    fetchOrder();
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const orderId = sessionStorage.getItem("orderId");
      if (!orderId) return;
  

    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);
  

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cart', { withCredentials: true });
        setCartItems(response.data.items || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(subtotal);
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderId = window.location.pathname.split("/").pop();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/checkout/finalize/${orderId}`,
        {
          billingInfo: formData,
          paymentMethod: formData.paymentMethod,
          cartItems: cartItems,
        },
        { withCredentials: true }
      );

      console.log("Order finalized!", response.data);

      await axios.post("http://localhost:3000/api/cart/clear", {}, { withCredentials: true });

      navigate("/cart", { state: { message: "Order placed successfully!" } });

    } catch (error) {
      console.error("Error finalizing order:", error);
    }
  };

 

  return (
    <div className="checkout-container">
      <div className="billing-details">
        <h2>Billing Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone*</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Address*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Country*</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Postal Code*</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === "bank"}
                  onChange={handleInputChange}
                />
                Bank Transfer
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleInputChange}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                name="preferred_billing"
                checked={formData.preferred_billing}
                onChange={handleInputChange}
              />
              Use for future billing
            </label>
          </div>

          <button className="place-order" type="submit">
            Place Order
          </button>
        </form>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div className="item" key={item.variant_id}>
            <span>{item.name}</span>
            <span>${item.price} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary">
          <p>Subtotal: ${total.toFixed(2)}</p>
          <p>Shipping: Free</p>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
