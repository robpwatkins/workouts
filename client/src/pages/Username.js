import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Username = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState('');
  const { user/* , loading */ } = useAuthContext();

  console.log('Username user: ', user);

  useEffect(() => {
    if (user) setUsername(user.username);
  }, [user]);

  const validateUsername = async (username) => {
    if (username.length < 3) {
      setError('Please include at least 3 characters');
      return false;
    }

    if (username.length > 12) {
      setError('Please limit to 12 characters max');
      return false;
    }
  
    setCheckingUsername(true);
  
    const isValid = /^(?!.*--)(?!-)(?!.*-$)[0-9A-Za-z-]*$/.test(username);
  
    if (!isValid) {
      setError('Invalid username — see above guidelines');
      setCheckingUsername(false);
      return false;
    }
  
    const response = await fetch(`http://localhost:4001/username-check?username=${username}`);
    const exists = await response.json();
  
    if (exists) {
      setError('Username exists');
      setCheckingUsername(false);
      return false;
    }
  
    setCheckingUsername(false);
    setError('');
  };

  const handleChange = async (e) => {
    setUsername(e.target.value);

    if (!e.target.value) return;

    const isValid = await validateUsername(e.target.value);

    if (!isValid) return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4001/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username })
    });

    console.log('response: ', response);
  };

  return (
    <form className="username" onSubmit={e => handleSubmit(e)}>
      <h2>Personalize username</h2>
      <p>Username may contain letters, numbers and single hyphens, and may not begin or end with a hyphen.</p>
      <input
        type="username"
        onChange={e => handleChange(e)}
        value={username}
      />
      {error && <div className="error">{error}</div>}
      <button disabled={checkingUsername || !!error}>Continue</button>
      <button className="skip">Skip</button>
    </form>
  )
};

export default Username;