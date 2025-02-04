import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductsList';
import useFavorites from '../components/useFavourites';

const WomensFragrances = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const genderFilter = 'female';
  const { favorites, toggleFavorite } = useFavorites();

  const addToCart = (id) => {
    console.log(`Added product ${id} to cart`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching women's products...");
        const productResponse = await axios.get(`/api/products?gender=${genderFilter}`);

        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ProductList
      products={products}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      addToCart={addToCart}
      hoveredProduct={hoveredProduct}
      setHoveredProduct={setHoveredProduct}
      genderFilter={genderFilter}
    />
  );
};

export default WomensFragrances;
