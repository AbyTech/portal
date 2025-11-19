import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/premier logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);

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
          <h3>Premier Recovery and Monetization Portal</h3>
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-8">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full bg-card-darker border border-card-dark rounded-lg px-4 py-3 text-white" required />

          <button type="submit" disabled={loading} className="w-full bg-gradient-neon text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-text-secondary text-center mt-6">
          Already have an account? <Link to="/login" className="text-sidebar-active hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
