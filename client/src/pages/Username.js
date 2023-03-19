import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Username = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState('');
  const { user/* , loading */ } = useAuthContext();

  const handleChange = async (e) => setUsername(e.target.value);

  const handleBlur = async (e) => {
    if (!e.target.value) return;
    if (e.target.value.length < 3) return setError('Please include at least 3 characters');
    if (e.target.value.length > 12) return setError('Please limit to max 12 characters');

    setCheckingUsername(true);

    const isValid = /^(?!.*--)(?!-)(?!.*-$)[0-9A-Za-z-]*$/.test(e.target.value);

    if (!isValid) return setError('Invalid username — see above guidelines');

    const response = await fetch(`http://localhost:4001/username-check?email=${e.target.value}`);
    const exists = await response.json();
  
    if (exists) setError('Username exists');

    setCheckingUsername(false);
    setError('');
  };

  return (
    <form className="username">
      <h2>Personalize username</h2>
      <p>Username may contain letters, numbers and single hyphens, and may not begin or end with a hyphen.</p>
      <input
        type="username"
        onChange={e => handleChange(e)}
        onBlur={e => handleBlur(e)}
        value={username}
        placeholder={user ? user.username : "username"}
      />
      {error && <div className="error">{error}</div>}
      <button disabled={checkingUsername || !!error}>Continue</button>
      <button className="skip">Skip</button>
    </form>
  )
};

export default Username;