import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.className.includes('social')) await signup(email, password, username);
  };

  const handleClick = (buttonType) => {
    window.open(`http://localhost:4001/auth/${buttonType}`, '_self');
  }

  const handleUsernameChange = async (e) => {
    setUsername(e.target.value);
    const response = await fetch(`http://localhost:4001/username-check?email=${e.target.value}`);
    const json = await response.json();

    setUsernameExists(json);
  };
  
  return (
    <>
      <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign up</h3>
        <label>Email:</label>
        <input
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <label>Username:</label>
        <input
          type="username"
          onChange={e => handleUsernameChange(e)}
          value={username}
        />
        {usernameExists && <div className="error">Username already exists</div>}
        <button disabled={isLoading}>Continue</button>
        {error && <div className="error">{error}</div>}
        <p className="account">Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </form>
      <h4 className="social-heading">OR</h4>
      <form className="login social-login" onSubmit={handleSubmit}>
        <button className="social-button google-button" onClick={() => handleClick('google')}>
          <span className="social-icon google-icon "></span>
          Continue with Google
        </button>
        <button className="social-button fbook-button">
          <FontAwesomeIcon className="social-icon fbook-icon" icon={faFacebook} />
          Continue with Facebook
        </button>
      </form>
    </>
  );
};

export default Signup;