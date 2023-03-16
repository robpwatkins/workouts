import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, username) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, username })
      });
      const json = await response.json();
  
      if (!response.ok) {
        if (json.message) throw Error(json.message);
      }
  
      dispatch({ type: 'LOGIN', payload: json });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setError(err.message);
    }
  };

  return { signup, submitting, error };
};