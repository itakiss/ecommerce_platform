import { useState, useEffect } from 'react';
import axios from 'axios';


const useFavorites = (setFavoritesCount) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites...");
        const response = await axios.get('/api/favorites', { withCredentials: true });
        const favoriteIds = response.data.items.map((item) => item.variant_id);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    try {
      if (favorites.includes(id)) {
        console.log(`Removing product ${id} from favorites...`);
        await axios.delete('/api/favorites', { data: { variant_id: id } });
        setFavorites((prev) => prev.filter((fav) => fav !== id));
      } else {
        console.log(`Adding product ${id} to favorites...`);
        await axios.post('/api/favorites', { variant_id: id });
        setFavorites((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error(`Error toggling favorite for product ${id}:`, error);
      alert('Failed to update favorites. Please try again.');
    }
};


  return { favorites, toggleFavorite };
};

export default useFavorites;
