import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../Root';
import apiService from '../services/api';

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
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-login-styles]')) {
    styleSheet.setAttribute('data-login-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData);
      console.log('Login response:', response);
      
      const userData = response.data || response.user || response;
      const token = response.token || userData.token;
      
      if (userData && token) {
        login(userData, token);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
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

      <div className="max-w-md w-full space-y-8 relative z-10">
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
              Welcome Back
            </h2>
            <p className={`text-lg text-gray-600 ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '0.4s'}}>
              Sign in to explore amazing food trucks
            </p>
            <div className={`flex items-center justify-center mt-4 ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '0.5s'}}>
              <Sparkles className="w-5 h-5 text-sky-400 mr-2" />
              <span className="text-sm text-sky-600 font-medium">Discover • Taste • Enjoy</span>
              <Sparkles className="w-5 h-5 text-sky-400 ml-2" />
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
            
            <div className="space-y-5">
              <div className={`${
                isVisible ? 'animate-slideInLeft' : 'opacity-0'
              }`} style={{animationDelay: '0.7s'}}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-sky-400 group-focus-within:text-sky-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={`${
                isVisible ? 'animate-slideInRight' : 'opacity-0'
              }`} style={{animationDelay: '0.8s'}}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-sky-400 group-focus-within:text-sky-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white/50 border border-sky-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all duration-200 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-sky-50 rounded-r-xl transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '0.9s'}}>
              <label className="flex items-center bg-sky-50/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-sky-50 transition-colors">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-sky-500 focus:ring-sky-300 border-sky-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Remember me</span>
              </label>

              <Link 
                to="/forgot-password" 
                className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center py-4 px-6 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isVisible ? 'animate-fadeInUp' : 'opacity-0'
              }`} 
              style={{animationDelay: '1s'}}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing you in...
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className={`text-center ${
              isVisible ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{animationDelay: '1.1s'}}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sky-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to Curbside?</span>
                </div>
              </div>
              <div className="mt-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl hover:border-sky-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Create Free Account
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

export default Login;