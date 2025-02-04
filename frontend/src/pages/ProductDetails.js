import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LimitExceededModal from './LimitExceededModal';
import './ProductDetails.css';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400';

const ProductDetails = () => {
  const { variantId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/productDetails/${variantId}`);
        const productData = response.data;

        const mainImageUrl = productData.variant.main_image_url || FALLBACK_IMAGE;
        let additionalImages = productData.variant.additional_images || [];

        if (!additionalImages.includes(mainImageUrl)) {
          additionalImages = [mainImageUrl, ...additionalImages];
        }

        setThumbnails(additionalImages.slice(0, 4));
        setMainImage(mainImageUrl);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [variantId]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        variant_id: variantId,
        quantity: parseInt(quantity, 10),
      });

      if (response.data.message.includes('Cart item limit exceeded')) {
        setModalMessage('Cart item limit exceeded (max 10 items)');
        setShowModal(true);
        return;
      }

      setSuccessMessage('✔ Product added to cart successfully!');
      

      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setSuccessMessage('❌ Failed to add product to cart.');
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const closeModal = () => setShowModal(false);
  const handleThumbnailClick = (imageUrl) => setMainImage(imageUrl);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      {showModal && <LimitExceededModal message={modalMessage} onClose={closeModal} />}

      <div className="images-section">
        <div className="image-thumbnails">
          {thumbnails.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${image === mainImage ? 'selected' : ''}`}
              onClick={() => handleThumbnailClick(image)}
            />
          ))}
        </div>

        <div className="main-image-container">
          <img src={mainImage} alt={product.product_name} className="main-image" />
        </div>

        <div className="product-info">
          <h1>{product.product_name}</h1>
          <p>Category: {product.category_name}</p>
          <p>Brand: {product.brand_name}</p>
          <p>Bottle Size: {product.variant.bottle_size} ml</p>
          <p className="price">€{product.variant.price}</p>

          <div className="quantity-counter">
            <button onClick={decrementQuantity} className="quantity-button">-</button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={incrementQuantity} className="quantity-button">+</button>
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>

          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      </div>

      <div className="details">
        <h2>Details</h2>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
