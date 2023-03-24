import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();

      if (!response.ok) {
        if (json.message) throw Error(json.message);
      }

      dispatch({ type: 'LOGIN', payload: json });
      setLoading(false);
      navigate('/username');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return { signup, loading, error };
};