import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  const googleLogin = (e) => {
    e.preventDefault();
    window.open("http://localhost:4001/auth/google", "_self");
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
        {error && <div className="error">{error}</div>}
        <p className="account">Don't have an account?
          <Link to="/signup">Sign up</Link>
        </p>
      </form>
      <h4 className="social-heading">OR</h4>
      <form className="login social-login">
        <button className="social-button google-button" onClick={googleLogin}>
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

export default Login;