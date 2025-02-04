import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import ConfirmationModal from './ConfirmationModal';
import LimitExceededModal from './LimitExceededModal';

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isLimitExceededModalOpen, setIsLimitExceededModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/cart', { withCredentials: true });
          setCartItems(response.data.items || []);
        } catch (error) {
          setErrorMessage('Error fetching cart items. Please try again later.');
          console.error('Error fetching cart items:', error);
        }
      };
      fetchCartItems();
    }
  }, [user]);

  const handleRemoveClick = (variantId) => {
    setItemToRemove(variantId);
    setIsModalOpen(true);
  };

  const confirmRemoveFromCart = async () => {
    if (itemToRemove) {
      try {
        await axios.delete(`http://localhost:3000/api/cart/${itemToRemove}`, { withCredentials: true });
        setCartItems((prevItems) => prevItems.filter((item) => item.variant_id !== itemToRemove));
      } catch (error) {
        console.error('Error removing item from cart:', error);
        setErrorMessage('Unable to remove item. Please try again.');
      } finally {
        setIsModalOpen(false);
        setItemToRemove(null);
      }
    }
  };

  const cancelRemoveFromCart = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity < 1) return;

    if (newQuantity > 10) {
      setIsLimitExceededModalOpen(true);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variant_id === variantId ? { ...item, quantity: newQuantity } : item
      )
    );

    const updateCart = async () => {
      try {
        await axios.post(
          'http://localhost:3000/api/cart/update',
          { variant_id: variantId, quantity: newQuantity },
          { withCredentials: true }
        );
      } catch (error) {
        console.error('Error updating cart:', error);
        setErrorMessage('Error updating cart item. Please try again.');
      }
    };
    updateCart();
  };

  const proceedToCheckout = async () => {
    try {

      const orderResponse = await axios.post('http://localhost:3000/api/checkout', {}, { withCredentials: true });
  
      if (orderResponse.status === 200) {
        const orderId = orderResponse.data.order_id;
        console.log("Draft order created, navigating to checkout:", orderId);
  
        sessionStorage.setItem("orderId", orderId);
  
        navigate(`/checkout/${orderId}`);
      } else {
        console.error("Unexpected response from order creation:", orderResponse);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Error creating order. Please try again.');
    }
  };
  
  
    
  const getSubtotal = () => parseFloat(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2));

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = 0;
    return parseFloat((subtotal + shipping).toFixed(2));
  };

  const closeLimitExceededModal = () => {
    setIsLimitExceededModalOpen(false);
  };

  if (!user) {
    return <div>Please log in to view your cart.</div>;
  }

  return (
    <div className="cart-page">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelRemoveFromCart}
        onConfirm={confirmRemoveFromCart}
        message="Are you sure you want to remove this item from your cart?"
      />

      {isLimitExceededModalOpen && (
        <LimitExceededModal
          message="You cannot add more than 10 items of this product."
          onClose={closeLimitExceededModal}
        />
      )}

      <div className="cart-box">
        <div className="cart-header">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
          <div>Remove</div>
        </div>

        {cartItems.map((item) => (
          <div key={item.variant_id} className="cart-item">
            <div className="image-container">
              <div className="image-wrapper">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div>{item.name}</div>
            </div>

            <div className="cart-item-price">${item.price}</div>

            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.variant_id, item.quantity + 1)}>
                <img src="/assets/Drop-Up-Small.png" alt="Increase quantity" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.variant_id, item.quantity - 1)}
                disabled={item.quantity === 1}
              >
                <img src="/assets/Drop-Down-Small.png" alt="Decrease quantity" />
              </button>
            </div>

            <div className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>

            <div className="remove-item" onClick={() => handleRemoveClick(item.variant_id)}>
              <img src="/assets/icon-minus.svg" alt="Remove item" />
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Cart Total</h3>
        <p>Subtotal: ${getSubtotal()}</p>
        <p>Shipping: Free</p>
        <p>Total: ${getTotal()}</p>
        <button onClick={proceedToCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;