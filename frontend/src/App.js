import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const Register = ({ handleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email, password);
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

const Dashboard = ({ handleLogout }) => {
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }
        `,
      });

      const { userId, token, tokenExpiration } = response.data.data.login;
      localStorage.setItem('token', token);
      setLoggedIn(true);
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const handleRegister = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation {
            register(email: "${email}", password: "${password}") {
              id
              email
            }
          }
        `,
      });

      console.log('Registration successful');
      console.log(response.data.data.register);
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <Switch>
          <Route exact path="/login">
            {isLoggedIn ? (
              <Redirect to="/dashboard" />
            ) : (
              <Login handleLogin={handleLogin} />
            )}
          </Route>
          <Route exact path="/register">
            <Register handleRegister={handleRegister} />
          </Route>
          <PrivateRoute
            path="/dashboard"
            component={Dashboard}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
