import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FoodTrucks from './pages/FoodTrucks';
import FoodTruckDetail from './pages/FoodTruckDetail';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Support from './pages/Support';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Map from './components/Map'; 
import EditFoodTruck from './pages/EditFoodTruck';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationPanel from './components/NotificationPanel';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to decode JWT and check expiration
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Auto-logout function
  const autoLogout = () => {
    console.log('Token expired - logging out automatically');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        autoLogout();
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Check token expiration periodically
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (isTokenExpired(token)) {
        autoLogout();
      }
    };

    // Check every minute
    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    let userRoles = [];
    
    if (user.roles) {
      if (Array.isArray(user.roles)) {
        userRoles = user.roles.map(role => {
          if (typeof role === 'string') {
            return role.toLowerCase();
          } else if (role && typeof role === 'object' && role.name) {
            return typeof role.name === 'string' ? role.name.toLowerCase() : '';
          } else if (role && typeof role === 'object' && role.roleName) {
            return typeof role.roleName === 'string' ? role.roleName.toLowerCase() : '';
          }
          return '';
        }).filter(role => role !== '');
      } else if (typeof user.roles === 'string') {
        userRoles = [user.roles.toLowerCase()];
      }
    } else if (user.role) {
      if (typeof user.role === 'string') {
        userRoles = [user.role.toLowerCase()];
      }
    } else if (user.userType) {
      if (typeof user.userType === 'string') {
        userRoles = [user.userType.toLowerCase()];
      }
    }
    
    return rolesArray.some(requiredRole => {
      if (typeof requiredRole !== 'string') return false;
      return userRoles.includes(requiredRole.toLowerCase());
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <NotificationPanel />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register", 
        element: <Register />
      },
      {
        path: "food-trucks",
        element: <FoodTrucks />
      },
      {
        path: "food-trucks/:id",
        element: <FoodTruckDetail />
      },
      {
        path: "map",
        element: <Map />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />
      },
      {
        path: "terms",
        element: <TermsOfService />
      },
      {
        path: "support",
        element: <Support />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "vendor-dashboard",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "vendor",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "vendor/dashboard",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "admin-dashboard",
        element: <Navigate to="/admin" replace />
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        )
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "food-trucks/:id/edit",
        element: (
          <ProtectedRoute requiredRoles={['vendor', 'admin']}>
            <EditFoodTruck />
          </ProtectedRoute>
        )
      },

      {
        path: "my-dashboard",
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "user-dashboard",
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
]);

const Root = () => {
  return <RouterProvider router={router} />;
};

export default Root;