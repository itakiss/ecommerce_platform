import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = ({
  products,
  filters,
  favorites,
  toggleFavorite,
  addToCart,
  hoveredProduct,
  setHoveredProduct,
  genderFilter,
  fetchFilteredProducts,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { updateFavoritesCount } = useOutletContext();
  const { updateFavoritesCount: updateFavoritesCountContext } = useOutletContext();

  useEffect(() => {
    if (products.length === 0) return;

    const filtered = products.filter((product) => {
      if (!product.variant || product.variant.price === undefined) return false;

      const matchesGender = genderFilter
        ? product.gender === genderFilter || product.gender === 'unisex'
        : true;

      return matchesGender;
    });

    console.log('Products before filtering:', products);
    console.log('Gender filter applied:', genderFilter);
    setFilteredProducts(filtered);
  }, [products, genderFilter]);

  return (
    <div>
     

      {/* Product List */}
      <div className="list-of-products">
        {filteredProducts.map((product) => (
          <div key={product.variant.variant_id} className="product">
            <div
              className="product-image"
              onMouseEnter={() => setHoveredProduct(product.variant.variant_id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product-image-container">
                <Link to={`/product/${product.variant.variant_id}`} class="product-link">
                  <img src={product.variant.main_image_url} alt={product.product_name} className="product-image" />
                </Link>
              </div>

              <div className="icons-on-image">
                <div
                  className="heart-element-on-image"
                  onClick={async () => {
                    await toggleFavorite(product.variant.variant_id);
                    updateFavoritesCount(favorites.length);

                  }}
                >
                  <img
                    src={
                      favorites.includes(product.variant.variant_id)
                        ? '/assets/heart_red.svg'
                        : '/assets/heart-small.svg'
                    }
                    alt="Favorite Icon"
                  />
                </div>
              </div>
           
            </div>
            <div className="product-information">
              <div className="name-of-product">
                {product.product_name ?? 'Product Name Not Available'}
              </div>
              <div className="price-element">
                <div className="price-amount">${product.variant.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
