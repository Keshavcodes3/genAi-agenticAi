import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../Components/AuthLayout';
import AuthInput from '../Components/AuthInput';
import AuthButton from '../Components/AuthButton';
import authService from '../Service/authService';
import { useAuth } from '../Hooks/useAuth';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      if (response.success) {
        navigate('/dashboard'); // or wherever the home is
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back to StoryBook.ai" 
      subtitle="Continue your creative journey. Log in to access your library and generate new masterpieces."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1 mb-8">
          <h2 className="text-3xl font-bold text-[#110E2C]">Log In</h2>
          <p className="text-sm font-medium text-[#8B88A5]">Enter your credentials to access your account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="text-sm text-violet-500 hover:text-violet-400 transition-colors">
            Forgot password?
          </Link>
        </div>

        <AuthButton isLoading={loading}>
          <LogIn size={18} />
          Sign In
        </AuthButton>

        <p className="text-center text-sm font-medium text-[#8B88A5] pt-4">
          Don't have an account?{' '}
          <Link to="/register" name="register-link" id="register-link" className="text-violet-600 hover:text-violet-700 transition-colors font-bold underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
