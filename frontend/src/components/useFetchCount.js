import { useEffect } from 'react';
import axios from 'axios';

const useFetchCount = (user, type, setCount) => {
  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/${type}/count`, { withCredentials: true });
        setCount(response.data.count);
      } catch (error) {
        console.error(`Error fetching ${type} count:`, error);
      }
    };

    fetchCount();
  }, [user, type, setCount]);

  return null;
};

export default useFetchCount;