// Fixed Favorites.js with Favorites Count Display
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LimitExceededModal from './LimitExceededModal';
import './Favorites.css';

const Favorites = ({ user, updateFavoritesCount }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/favorites', { withCredentials: true });
          if (response.data.items) {
            setFavorites(response.data.items);
            updateFavoritesCount(response.data.items.length);
          } else {
            setFavorites([]);
            updateFavoritesCount(0);
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setFavorites([]);
          updateFavoritesCount(0);
        }
      } else {
        setFavorites([]);
        updateFavoritesCount(0);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user, updateFavoritesCount]);

  const addToCart = async (variantId) => {
    try {
      const response = await axios.post('/api/cart', { variant_id: variantId }, { withCredentials: true });

      if (response.data.message.includes('Cart item limit exceeded')) {
        setModalMessage('Cart item limit exceeded (max 10 items)');
        setShowModal(true);
        return;
      }

      const deleteResponse = await axios.delete('/api/favorites', {
        data: { variant_id: variantId },
        withCredentials: true,
      });

      setFavorites((prevFavorites) => prevFavorites.filter((product) => product.variant_id !== variantId));

      if (deleteResponse.data.count !== undefined) {
        updateFavoritesCount(deleteResponse.data.count);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const moveAllToCart = async () => {
    try {
      const response = await axios.post('/api/favorites/move-all', {}, { withCredentials: true });
      setFavorites([]);
      updateFavoritesCount(0);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error moving all favorites to cart:', error);
    }
  };

  const removeFromFavorites = async (variantId) => {
    try {
      const deleteResponse = await axios.delete('/api/favorites', {
        data: { variant_id: variantId },
        withCredentials: true,
      });

      if (deleteResponse.data.count !== undefined) {
        setFavorites((prevFavorites) => prevFavorites.filter((product) => product.variant_id !== variantId));
        updateFavoritesCount(deleteResponse.data.count);
      }
    } catch (error) {
      console.error('Error removing product from favorites:', error);
    }
  };

  return (
    <div className="Favorites">
      {user ? (
        <>
          {showModal && <LimitExceededModal message={modalMessage} onClose={closeModal} />}

          <div className="favorites-header">
            <h2>Favorites</h2>
            <div className="favorites-count-badge">
            </div>
          </div>

          <div className="move-all-to-cart">
            <button onClick={moveAllToCart}>Move All to Cart</button>
          </div>

          <div className="list-of-products">
            {favorites.map((product) => (
              <div key={product.variant_id} className="product">
                <div
                  className="product-image"
                  onMouseEnter={() => setHoveredProduct(product.variant_id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >

                    <img src={product.image_url || '/assets/default-image.jpg'} alt={product.product_name} />


                  {hoveredProduct === product.variant_id && (
                    <div className="add-to-cart-btn" onClick={() => addToCart(product.variant_id)}>
                      Add to Cart
                    </div>
                  )}

                  <div
                    className="remove-from-favorites"
                    onClick={() => removeFromFavorites(product.variant_id)}
                  >
                    <img src="/assets/TRASHcAN.png" alt="Remove from favorites" />
                  </div>
                </div>

                <div className="product-information">
                  <div className="name-of-product">{product.product_name}</div>
                  <div className="price-element">
                    <div className="price-amount">${product.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>Please log in to view your favorites.</div>
      )}
    </div>
  );
};

export default Favorites;
