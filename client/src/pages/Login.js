import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();
  const { error: passportError } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.className.includes('social')) await login(email, password);
  };
  
  const handleClick = (buttonType) => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/${buttonType}`, '_self');
  }

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h3>Log in</h3>
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
        <button disabled={isLoading}>Continue</button>
        {(error || passportError) && <div className="error">{error || passportError}</div>}
        <p className="account">Don't have an account?
          <Link to="/signup">Sign up</Link>
        </p>
      </form>
      <h4 className="social-heading">OR</h4>
      <form className="login social-login" onSubmit={handleSubmit}>
        <button className="social-button google-button" onClick={() => handleClick('google')}>
          <span className="social-icon google-icon "></span>
          Continue with Google
        </button>
        <button className="social-button fbook-button" onClick={() => handleClick('facebook')}>
          <FontAwesomeIcon className="social-icon fbook-icon" icon={faFacebook} />
          Continue with Facebook
        </button>
      </form>
    </>
  );
};

export default Login;