import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

const RegisterPage: React.FC = () => {
  const { register, isLoading } = useSimpleAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    displayname: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    displayname: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
    general: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });
  
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
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';
    
    if (password.length === 0) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }
    
    // Length check
    if (password.length < 8) {
      feedback = 'Password should be at least 8 characters long';
    } else {
      score += 1;
    }
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Feedback based on score
    if (score === 2) feedback = 'Weak password';
    else if (score === 3) feedback = 'Medium strength password';
    else if (score === 4) feedback = 'Strong password';
    else if (score === 5) feedback = 'Very strong password';
    
    setPasswordStrength({ score, feedback });
  };
  
  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
      case 2:
        return 'bg-powder-blush-500';
      case 3:
        return 'bg-powder-petal-400';
      case 4:
        return 'bg-powder-blue-500';
      case 5:
        return 'bg-powder-blue-600';
      default:
        return 'bg-twilight-indigo-200 dark:bg-twilight-indigo-600';
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
    
    // Display name validation
    if (!formData.displayname) {
      newErrors.displayname = 'Display name is required';
      isValid = false;
    } else if (formData.displayname.length < 3) {
      newErrors.displayname = 'Display name must be at least 3 characters';
      isValid = false;
    } else {
      newErrors.displayname = '';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    } else {
      newErrors.confirmPassword = '';
    }
    
    // Terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    } else {
      newErrors.agreeTerms = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ ...errors, general: '' });
    
    if (validate()) {
      try {
        await register(formData.email, formData.password, formData.displayname);
        navigate('/login', { state: { registered: true } });
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          general: 'Registration failed. This email may already be registered.'
        }));
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-twilight-indigo-50 dark:bg-twilight-indigo-800">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-powder-petal-500 dark:text-powder-petal-400">Create Your Account</h1>
          <p className="mt-2 text-twilight-indigo-600 dark:text-twilight-indigo-200">
            Join our community of book lovers
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
              <label htmlFor="displayname" className="block text-sm font-medium mb-1 text-twilight-indigo-700 dark:text-twilight-indigo-100">
                Display Name
              </label>
              <input
                id="displayname"
                name="displayname"
                type="text"
                autoComplete="name"
                value={formData.displayname}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.displayname ? 'border-powder-blush-500 dark:border-powder-blush-500' : 'border-twilight-indigo-200 dark:border-twilight-indigo-500'} focus:outline-none focus:ring-2 focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400 bg-white dark:bg-twilight-indigo-600 text-twilight-indigo-800 dark:text-white`}
                placeholder="How you'll appear to others"
              />
              {errors.displayname && (
                <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.displayname}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-twilight-indigo-700 dark:text-twilight-indigo-100">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-twilight-indigo-200 dark:bg-twilight-indigo-600 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getStrengthColor()}`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-xs text-twilight-indigo-500 dark:text-twilight-indigo-300">
                    {passwordStrength.feedback || 'Password should contain at least 8 characters, uppercase, lowercase, numbers and special characters'}
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-twilight-indigo-700 dark:text-twilight-indigo-100">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${errors.confirmPassword ? 'border-powder-blush-500 dark:border-powder-blush-500' : 'border-twilight-indigo-200 dark:border-twilight-indigo-500'} focus:outline-none focus:ring-2 focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400 bg-white dark:bg-twilight-indigo-600 text-twilight-indigo-800 dark:text-white`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-powder-petal-500 dark:text-powder-petal-400 border-twilight-indigo-300 dark:border-twilight-indigo-500 rounded focus:ring-powder-petal-400 dark:focus:ring-powder-petal-400"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-twilight-indigo-700 dark:text-twilight-indigo-200">
                  I agree to the{' '}
                  <Link to="/terms" className="text-powder-petal-500 dark:text-powder-petal-300 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-powder-petal-500 dark:text-powder-petal-300 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-powder-blush-600 dark:text-powder-blush-400">{errors.agreeTerms}</p>
                )}
              </div>
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-twilight-indigo-600 dark:text-twilight-indigo-300">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-powder-petal-500 dark:text-powder-petal-300 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;