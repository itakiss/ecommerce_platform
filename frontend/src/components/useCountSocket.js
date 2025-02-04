import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useCountSocket = (userId, event, setCount) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000');
    }

    const socket = socketRef.current;

    socket.on(event, (data) => {
      if (data.userId === userId) {
        setCount(data.count);
      }
    });

    return () => {
      socket.off(event);
    };
  }, [userId, event, setCount]);

  return null;
};

export default useCountSocket;
