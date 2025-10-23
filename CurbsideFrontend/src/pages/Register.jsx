import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Truck, ArrowRight, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../Root';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5194/api';

const pageStyles = `
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.4); }
    50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.6); }
  }
  @keyframes checkmark {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-checkmark { animation: checkmark 0.3s ease-out forwards; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-register-styles]')) {
    styleSheet.setAttribute('data-register-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'appuser',
    preferredRadius: 5
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [validationState, setValidationState] = useState({
    userName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    const newValidationState = { ...validationState };
    switch (name) {
      case 'userName':
        newValidationState.userName = value.length >= 3;
        break;
      case 'email':
        newValidationState.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'password':
        newValidationState.password = value.length >= 6;
        if (formData.confirmPassword) {
          newValidationState.confirmPassword = value === formData.confirmPassword;
        }
        break;
      case 'confirmPassword':
        newValidationState.confirmPassword = value === formData.password && value.length > 0;
        break;
    }
    setValidationState(newValidationState);
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = data.data || data.user || data;
        const token = data.token || userData.token;
        
        if (userData && token) {
          login(userData, token);
          navigate('/dashboard');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/25 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-sky-300/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 transform transition-all duration-700 ${
          isVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'
        }`}>
          
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full shadow-xl mb-6 pulse-glow ${
              isVisible ? 'animate-slideInLeft' : 'opacity-0'
            }`} style={{animationDelay: '0.2s'}}>
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h2 className={`text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-3 ${
              isVisible ? 'animate-slideInRight' : 'opacity-0'
            }`} style={{animationDelay: '0.3s'}}>
              Join Curbside
            </h2>
            <p className={`text-lg text-gray-600 mb-4 ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '0.4s'}}>
              Start your delicious journey today
            </p>
            <div className={`flex items-center justify-center ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '0.5s'}}>
              <Shield className="w-5 h-5 text-sky-400 mr-2" />
              <span className="text-sm text-sky-600 font-medium">Safe • Secure • Simple</span>
              <Shield className="w-5 h-5 text-sky-400 ml-2" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg ${
                isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`} style={{animationDelay: '0.6s'}}>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 text-sm font-bold">!</span>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`${
                isVisible ? 'animate-slideInLeft' : 'opacity-0'
              }`} style={{animationDelay: '0.7s'}}>
                <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 transition-colors ${
                      validationState.userName ? 'text-green-500' : 'text-sky-400'
                    } group-focus-within:text-sky-500`} />
                  </div>
                  <input
                    name="userName"
                    type="text"
                    required
                    className={`w-full pl-12 pr-10 py-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm ${
                      validationState.userName 
                        ? 'border-green-300 focus:border-green-400' 
                        : 'border-sky-200 focus:border-sky-400'
                    }`}
                    placeholder="Choose a unique username"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                  {validationState.userName && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 animate-checkmark" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 3 characters</p>
              </div>

              <div className={`${
                isVisible ? 'animate-slideInRight' : 'opacity-0'
              }`} style={{animationDelay: '0.8s'}}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${
                      validationState.email ? 'text-green-500' : 'text-sky-400'
                    } group-focus-within:text-sky-500`} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className={`w-full pl-12 pr-10 py-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm ${
                      validationState.email 
                        ? 'border-green-300 focus:border-green-400' 
                        : 'border-sky-200 focus:border-sky-400'
                    }`}
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {validationState.email && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 animate-checkmark" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">We'll never share your email</p>
              </div>

              <div className={`${
                isVisible ? 'animate-slideInLeft' : 'opacity-0'
              }`} style={{animationDelay: '0.9s'}}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      validationState.password ? 'text-green-500' : 'text-sky-400'
                    } group-focus-within:text-sky-500`} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full pl-12 pr-20 py-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm ${
                      validationState.password 
                        ? 'border-green-300 focus:border-green-400' 
                        : 'border-sky-200 focus:border-sky-400'
                    }`}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                    {validationState.password && (
                      <CheckCircle className="h-5 w-5 text-green-500 animate-checkmark" />
                    )}
                    <button
                      type="button"
                      className="hover:bg-sky-50 rounded-lg p-1 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-sky-400 hover:text-sky-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-sky-400 hover:text-sky-600" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div className={`${
                isVisible ? 'animate-slideInRight' : 'opacity-0'
              }`} style={{animationDelay: '1s'}}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${
                      validationState.confirmPassword ? 'text-green-500' : 'text-sky-400'
                    } group-focus-within:text-sky-500`} />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`w-full pl-12 pr-20 py-4 bg-white/50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm ${
                      validationState.confirmPassword 
                        ? 'border-green-300 focus:border-green-400' 
                        : 'border-sky-200 focus:border-sky-400'
                    }`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
                    {validationState.confirmPassword && (
                      <CheckCircle className="h-5 w-5 text-green-500 animate-checkmark" />
                    )}
                    <button
                      type="button"
                      className="hover:bg-sky-50 rounded-lg p-1 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-sky-400 hover:text-sky-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-sky-400 hover:text-sky-600" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must match password above</p>
              </div>
            </div>

            <div className={`${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '1.1s'}}>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative cursor-pointer ${formData.role === 'appuser' ? 'ring-2 ring-sky-400' : ''} rounded-xl`}>
                  <input
                    type="radio"
                    name="role"
                    value="appuser"
                    checked={formData.role === 'appuser'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'appuser' 
                      ? 'border-sky-400 bg-sky-50' 
                      : 'border-gray-200 bg-white/50 hover:border-sky-300'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🍔</div>
                      <div className="font-semibold text-gray-900">Food Lover</div>
                      <div className="text-xs text-gray-500 mt-1">Discover & enjoy amazing food</div>
                    </div>
                  </div>
                </label>
                
                <label className={`relative cursor-pointer ${formData.role === 'vendor' ? 'ring-2 ring-sky-400' : ''} rounded-xl`}>
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={formData.role === 'vendor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === 'vendor' 
                      ? 'border-sky-400 bg-sky-50' 
                      : 'border-gray-200 bg-white/50 hover:border-sky-300'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚚</div>
                      <div className="font-semibold text-gray-900">Food Truck Owner</div>
                      <div className="text-xs text-gray-500 mt-1">Manage your food truck business</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !Object.values(validationState).every(Boolean)}
              className={`group relative w-full flex justify-center items-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`} 
              style={{animationDelay: '1.2s'}}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating Your Account...
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Create My Account</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className={`text-center ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '1.3s'}}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sky-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl hover:border-sky-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign In Instead
                  <Sparkles className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;