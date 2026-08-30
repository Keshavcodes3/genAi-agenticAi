/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../Components/AuthLayout';
import AuthInput from '../Components/AuthInput';
import AuthButton from '../Components/AuthButton';
import authService from '../Service/authService';
import { useAuth } from '../Hooks/useAuth'
const avatars = [
  "https://i.pinimg.com/736x/28/2c/67/282c6790658e5be6688d4e7670085fc1.jpg",
  "https://i.pinimg.com/736x/0c/08/fd/0c08fda0bf680a8979d7527eedc34e52.jpg",
  "https://i.pinimg.com/736x/24/ba/86/24ba86595a4c41afe490d9bf745e9d10.jpg",
  "https://i.pinimg.com/736x/e4/32/12/e43212860a10e5e63c80c2ce5f76f8b3.jpg",
  "https://i.pinimg.com/736x/3b/7f/92/3b7f9200765cef5a0294800ec6031ea1.jpg",
  "https://i.pinimg.com/736x/23/7e/86/237e86256a97db4987555b0e3dbaf407.jpg",
  "https://i.pinimg.com/736x/b4/22/27/b42227b55bae72b1d3894db148b44c55.jpg",

];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth()
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: avatars[0]
  });
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const nextAvatar = () => {
    const newIndex = (avatarIndex + 1) % avatars.length;
    setAvatarIndex(newIndex);
    setFormData({ ...formData, avatar: avatars[newIndex] });
  };

  const prevAvatar = () => {
    const newIndex = (avatarIndex - 1 + avatars.length) % avatars.length;
    setAvatarIndex(newIndex);
    setFormData({ ...formData, avatar: avatars[newIndex] });
  };

  const nextStep = () => {
    if (step === 1 && !formData.username) {
      setError('Please choose a username');
      return;
    }
    setStep(2);
    setError('');
  };

  const prevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      if (response.success) {
        navigate('/login');
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Turn Your Imagination Into Story/Poetry"
      subtitle="Join our community of visionaries and start crafting unique digital narratives with the power of AI."
    >
      <div className="space-y-1 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#110E2C]">Sign Up</h2>
          <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
            Step {step} of 2
          </span>
        </div>
        <p className="text-sm font-medium text-[#8B88A5]">
          {step === 1 ? "Choose your identity" : "Secure your account"}
        </p>
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

      <form onSubmit={handleSubmit} className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="block text-[#110E2C] text-sm font-bold text-center">Select Avatar</label>
                <div className="flex items-center justify-between bg-white border border-purple-100/60 p-4 rounded-2xl shadow-sm">
                  <button
                    type="button"
                    onClick={prevAvatar}
                    className="p-3 bg-violet-50 hover:bg-violet-100 rounded-full text-violet-600 transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <motion.div
                    key={avatarIndex}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="relative size-28 rounded-full border-4 border-violet-500 bg-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={avatars[avatarIndex]}
                      alt="Selected Avatar"
                      className="absolute h-full w-full object-cover scale-125"
                    />
                  </motion.div>

                  <button
                    type="button"
                    onClick={nextAvatar}
                    className="p-3 bg-violet-50 hover:bg-violet-100 rounded-full text-violet-600 transition-all hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <AuthInput
                label="Username"
                type="text"
                name="username"
                placeholder="storyteller_01"
                value={formData.username}
                onChange={handleChange}
                icon={User}
              />

              <div className="pt-2">
                <AuthButton type="button" onClick={nextStep}>
                  Next Step
                  <ArrowRight size={18} />
                </AuthButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
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

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-white hover:bg-zinc-50 text-[#110E2C] font-bold py-3 rounded-xl transition-all border border-purple-100/60 shadow-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <div className="flex-[2]">
                  <AuthButton isLoading={loading}>
                    <UserPlus size={18} />
                    Complete
                  </AuthButton>
                </div>
              </div>

              <div className="text-xs text-[#8B88A5] font-medium leading-relaxed text-center pt-2">
                By signing up, you agree to our{' '}
                <span className="text-violet-600 font-bold cursor-pointer hover:underline">Terms</span> and{' '}
                <span className="text-violet-600 font-bold cursor-pointer hover:underline">Privacy Policy</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm font-medium text-[#8B88A5] pt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 hover:text-violet-700 transition-colors font-bold underline underline-offset-4">
            Log in instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
