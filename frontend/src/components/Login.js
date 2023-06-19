import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN } from '../mutations';

const Login = ({ setLoggedIn, getToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ variables: { email, password } });
      const { userId, token, tokenExpiration } = response.data.login;
      localStorage.setItem('token', token);
      setLoggedIn(true);
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter your Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
