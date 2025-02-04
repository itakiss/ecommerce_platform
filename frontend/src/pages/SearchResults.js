import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`/api/search?query=${searchQuery}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="list-of-products">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.product_id} className="product">
            {/* Render product details here */}
          </div>
        ))
      ) : (
        <div>No results found for "{searchQuery}"</div>
      )}
    </div>
  );
};

export default SearchResults;
