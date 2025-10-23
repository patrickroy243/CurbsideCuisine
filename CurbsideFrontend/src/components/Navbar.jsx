import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Truck, User, LogOut, Settings, MapPin, Bell, Shield, Mail } from 'lucide-react';
import { useAuth } from '../Root';
import { useNotification } from '../contexts/NotificationContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount, togglePanel } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/food-trucks', label: 'Food Trucks', icon: Truck },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="bg-gradient-to-r from-white via-sky-50 to-blue-50 shadow-xl border-b-2 border-gradient-to-r from-sky-200 to-blue-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 text-sky-600 hover:text-sky-700 transition-all duration-200 group">
              <div className="relative">
                <img 
                  src="/images/CurbsideLogo.png" 
                  alt="Curbside Cuisine Logo" 
                  className="h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Curbside Cuisine</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                    isActive(path)
                      ? 'text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg transform scale-105'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() && user ? (
              <>
                <button 
                  onClick={togglePanel}
                  className="relative p-3 text-gray-600 hover:text-sky-600 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
                      </div>
                    </>
                  )}
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-3 text-gray-700 hover:text-sky-600 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                      {user.name?.charAt(0).toUpperCase() || user.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold">{user.name || user.userName}</span>
                  </button>

                  <div className="absolute right-0 mt-3 w-52 bg-gradient-to-br from-white to-sky-50 border border-sky-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm">
                    <div className="py-3">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 hover:text-sky-600 transition-all duration-200 rounded-lg mx-2"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 hover:text-sky-600 transition-all duration-200 rounded-lg mx-2"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 hover:text-sky-600 transition-all duration-200 rounded-lg mx-2"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="mx-2 my-3 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 rounded-lg mx-2"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-sky-600 hover:text-sky-700 border-2 border-sky-300 hover:border-sky-500 rounded-xl transition-all duration-200 hover:shadow-md hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 text-gray-600 hover:text-sky-600 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-gradient-to-r from-sky-200 to-blue-200 bg-gradient-to-br from-white to-sky-50 backdrop-blur-sm">
            <div className="px-3 pt-3 pb-4 space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                    isActive(path)
                      ? 'text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg border-l-4 border-blue-700'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </Link>
              ))}
            </div>

            {isAuthenticated() && user ? (
              <div className="pt-4 pb-4 border-t-2 border-gradient-to-r from-sky-200 to-blue-200">
                <div className="flex items-center px-5 py-3 mx-3 bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
                    {user.name?.charAt(0).toUpperCase() || user.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-4">
                    <div className="text-base font-bold text-gray-800">{user.name || user.userName}</div>
                    <div className="text-sm text-gray-600 font-medium">{user.email}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 px-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-semibold text-gray-700 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-semibold text-gray-700 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-base font-semibold text-gray-700 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-base font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-4 border-t-2 border-gradient-to-r from-sky-200 to-blue-200">
                <div className="space-y-3 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-5 py-3 text-center text-base font-semibold text-sky-600 border-2 border-sky-300 hover:border-sky-500 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 shadow-sm hover:shadow-md"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full px-5 py-3 text-center text-base font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;