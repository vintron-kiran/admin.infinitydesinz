'use client';

import { useState } from 'react';
import { login } from '@/lib/authService';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const errors: { email: string; password: string } = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <div className="card-header bg-white text-center">
          <h5 className="text-dark m-0">Admin Login</h5>
        </div>
        <div className="card-body px-4 py-4">
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                placeholder="Enter Email"
                className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                placeholder="Enter Password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {fieldErrors.password && <div className="invalid-feedback">{fieldErrors.password}</div>}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-success py-2">Login</button>
            </div>

            {error && <p className="text-danger text-center mt-3">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
