import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Account.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Just call the endpoint as is, without userId in the URL
        const response = await axios.get("/api/checkout/ORDERS/user-orders", { withCredentials: true });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="order-item">
              <div className="order-info">
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.order_status}</p>
                <p><strong>Total:</strong> ${Number(order.total_amount).toFixed(2) || '0.00'}</p>
              </div>
              <button className="details-button">Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;

