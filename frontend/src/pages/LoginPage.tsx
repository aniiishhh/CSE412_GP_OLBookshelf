import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useSimpleAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ ...errors, general: '' });
    
    if (validate()) {
      try {
        await login(formData.email, formData.password);
        navigate('/');
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          general: 'Invalid email or password. Please try again.'
        }));
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-twilight-indigo-50 dark:bg-twilight-indigo-800">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-powder-petal-500 dark:text-powder-petal-400">Welcome Back!</h1>
          <p className="mt-2 text-twilight-indigo-600 dark:text-twilight-indigo-200">
            Sign in to access your personalized reading experience
          </p>
        </div>
        
        <div className="bg-white dark:bg-twilight-indigo-700 rounded-lg shadow-md p-6 border border-twilight-indigo-100 dark:border-twilight-indigo-600">
          {errors.general && (
            <div className="mb-4 p-3 bg-powder-blush-100 dark:bg-powder-blush-900/30 text-powder-blush-700 dark:text-powder-blush-300 rounded-md">
              {errors.general}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-twilight-indigo-700 dark:text-twilight-indigo-100">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.email ? 'border-powder-blush-500 dark:border-powder-blush-500' : 'border-twilight-indigo-200 dark:border-twilight-indigo-500'} focus:outline-none focus:ring-2 focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400 bg-white dark:bg-twilight-indigo-600 text-twilight-indigo-800 dark:text-white`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-twilight-indigo-700 dark:text-twilight-indigo-100">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-powder-petal-500 dark:text-powder-petal-300 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 rounded-md border ${errors.password ? 'border-powder-blush-500 dark:border-powder-blush-500' : 'border-twilight-indigo-200 dark:border-twilight-indigo-500'} focus:outline-none focus:ring-2 focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400 bg-white dark:bg-twilight-indigo-600 text-twilight-indigo-800 dark:text-white`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-twilight-indigo-400 dark:text-twilight-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-twilight-indigo-400 dark:text-twilight-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-powder-petal-500 dark:text-powder-petal-400 border-twilight-indigo-300 dark:border-twilight-indigo-500 rounded focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-twilight-indigo-700 dark:text-twilight-indigo-200">
                Remember me
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-powder-petal-500 dark:bg-powder-petal-400 text-white rounded-md hover:bg-powder-petal-600 dark:hover:bg-powder-petal-500 transition-colors shadow-sm flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-twilight-indigo-600 dark:text-twilight-indigo-300">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-powder-petal-500 dark:text-powder-petal-300 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;