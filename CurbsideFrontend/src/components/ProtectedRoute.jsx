import { Navigate } from 'react-router-dom';
import { useAuth } from '../Root';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - User roles:', user?.roles || user?.role);
    console.log('ProtectedRoute - Required roles:', requiredRoles);
    console.log('ProtectedRoute - Has required role:', hasRequiredRole);
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 text-sm">
              <p><strong>Your role:</strong> {user?.role || 'No role assigned'}</p>
              <p><strong>Required roles:</strong> {requiredRoles.join(', ')}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;