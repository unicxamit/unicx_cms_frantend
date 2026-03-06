import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../auth/Auth';
import { useNavigate } from 'react-router-dom';
import { safeSetItem } from '../utils/safeStorage';
import './serviceStyle/login.css';

const STATIC_LOGIN_DATA = {
  email: 'admin@example.com',
  password: 'Admin@123',
  token: 'static-admin-token',
  user: {
    role: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isValidLogin =
        email.trim().toLowerCase() === STATIC_LOGIN_DATA.email &&
        password === STATIC_LOGIN_DATA.password;

      if (!isValidLogin) {
        throw new Error('Invalid email or password');
      }

      safeSetItem('adminToken', STATIC_LOGIN_DATA.token);
      safeSetItem('user', JSON.stringify(STATIC_LOGIN_DATA.user));

      login(STATIC_LOGIN_DATA.user);
      navigate('/admin'); // Redirect to admin dashboard after login
    } catch (err) {
      setError(
        err?.message ||
        'Failed to log in.'
      );
    }

    setLoading(false);
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <aside className="admin-login-brand">
          <p className="admin-login-kicker">Admin Portal</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage content.</p>

        </aside>

        <div className="admin-login-form-wrap">
          <h2>Login</h2>
          <p className="admin-login-subtitle">Use your admin credentials to continue.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="admin-login-form">
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <div className="admin-login-password-row">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-login-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </Form.Group>

            <div className="admin-login-help">
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100 admin-login-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign in to dashboard'}
            </Button>
          </Form>

          <div className="admin-login-footer">
            Need an account? <a href="#">Sign Up</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
