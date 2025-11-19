import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/premier logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card-dark rounded-lg p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="Premier Logo" className="mx-auto w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-text-secondary mb-2">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-text-secondary mb-2">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-sidebar-active"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-neon text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-text-secondary text-center mt-6">
          Don't have an account? <Link to="/signup" className="text-sidebar-active hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
