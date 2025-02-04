import { useEffect } from 'react';
import io from 'socket.io-client';

const useFavoritesSocket = (userId, setFavoritesCount) => {
  useEffect(() => {
    if (!userId) return;

    const socket = io('http://localhost:3000');

    socket.on('favoritesUpdated', (data) => {
      if (data.userId === userId) {
        setFavoritesCount(data.count);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, setFavoritesCount]);

  return null;
};

export default useFavoritesSocket;
