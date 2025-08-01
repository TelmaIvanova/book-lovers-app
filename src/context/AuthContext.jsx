import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const provider = new BrowserProvider(window.ethereum);
  const domain = window.location.host;
  let [address, setAddress] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const fetchUserData = async () => {
        try {
          const type = localStorage.getItem('userType') || 'regular';
          const endpoint =
            type === 'ethereum'
              ? '/api/ethereumUsers/ethereumProfile'
              : '/api/users/profile';

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            throw new Error(data.message || 'Failed to fetch user data');
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserData();
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    setToken(data.token);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userType', 'regular');

    return data;
  };

  const connectWallet = async () => {
    const accounts = await provider
      .send('eth_requestAccounts', [])
      .catch(() => console.log('User rejected request'));

    console.log(accounts);
    if (accounts[0]) {
      setAddress(accounts[0]);
    }
  };

  const loginWithEthereum = async () => {
    const signer = await provider.getSigner();

    // Get nonce and nonceToken from backend
    const res = await fetch('/api/ethereumUsers/nonce');
    if (!res.ok) throw new Error('Failed to fetch nonce');
    const { nonce, nonceToken } = await res.json();

    localStorage.setItem('siwe-nonce', nonce);
    localStorage.setItem('siwe-nonceToken', nonceToken);

    // Create SIWE message
    const messageRaw = new SiweMessage({
      domain,
      address: await signer.getAddress(),
      statement: 'Sign in with Ethereum to the app.',
      uri: window.location.origin,
      version: '1',
      chainId: 1,
      nonce,
    });

    const message = messageRaw.prepareMessage();

    // Get signature
    const signature = await signer.signMessage(message);

    // Send message, signature and nonceToken to server
    const res2 = await fetch('/api/ethereumUsers/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        signature,
        nonceToken,
      }),
    });

    const data = await res2.json();

    if (!res2.ok) {
      throw new Error(data.message || 'Verification failed');
    }

    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userType', 'ethereum');
    return data;
  };

  const register = async (formData) => {
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error(error.message);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  };

  const deleteAccount = async (password) => {
    try {
      const response = await fetch('/api/users/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (response.status === 204) {
        logout();
        return { success: true, message: 'Account deleted successfully!' };
      }

      const errorData = await response.json();
      return { success: false, error: errorData.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'User-Role': user?.data?.user?.role,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update book');
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteBook = async (id) => {
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'User-Role': user?.data?.user?.role,
        },
      });

      if (res.status === 204) {
        window.location.href = '/books';
        return { success: true, message: 'Account deleted successfully!' };
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const voteBook = async (id, rating, token) => {
    try {
      const res = await fetch(`/api/books/${id}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) throw new Error('Failed to vote for book');

      return await res.json();
    } catch (error) {
      console.error('Error voting for book:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        loginWithEthereum,
        connectWallet,
        address,
        logout,
        register,
        deleteAccount,
        updateBook,
        deleteBook,
        voteBook,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
