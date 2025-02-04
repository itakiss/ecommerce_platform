import { useEffect } from 'react';
import io from 'socket.io-client';

const useCartSocket = (userId, setCartCount) => {
  useEffect(() => {
    if (!userId) return;

    const socket = io('http://localhost:3000');

    socket.on('cartUpdated', (data) => {
        if (data.userId === userId) {
          console.log(data.count);
          setCartCount(data.count);
        }
      });
      

    return () => {
      socket.disconnect();
    };
  }, [userId, setCartCount]);

  return null;
};

export default useCartSocket;
