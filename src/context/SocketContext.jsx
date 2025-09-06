import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io(
    process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
