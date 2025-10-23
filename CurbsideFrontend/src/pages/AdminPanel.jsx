import { useState, useEffect } from 'react';
import { useAuth } from '../Root';
import { 
  Users, 
  Truck, 
  Shield, 
  Eye, 
  Trash2, 
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Clock,
  TrendingUp,
  BarChart3,
  Activity,
  Settings,
  Crown,
  Database,
  Zap,
  Target,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
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
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .shimmer-loading {
    background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
    background-size: 200px;
    animation: shimmer 1.5s infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-admin-styles]')) {
    styleSheet.setAttribute('data-admin-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const AdminPanel = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrucks: 0,
    totalReviews: 0,
    activeVendors: 0
  });
  
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  useEffect(() => {
    // Always try to load data, but only allow admin actions if user has admin role
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading admin data...');
      
      // Load individual data sets first (these should work even without admin auth)
      const trucksData = await loadFoodTrucks();
      
      let usersData = [];
      try {
        usersData = await loadUsers();
      } catch (err) {
        console.log('Admin users endpoint not available:', err.message);
      }
      
      let reviewsData = [];
      try {
        reviewsData = await loadReviews();
      } catch (err) {
        console.log('Admin reviews endpoint not available:', err.message);
      }
      
      console.log('Data loaded:', {
        foodTrucks: trucksData.length,
        users: usersData.length,
        reviews: reviewsData.length
      });

      // Try to load statistics from admin endpoint
      let useAdminStats = false;
      let statsData = null;
      try {
        const statsResponse = await apiService.getAdminStatistics();
        console.log('Admin statistics response:', statsResponse);
        if (statsResponse?.success && statsResponse?.data) {
          statsData = statsResponse.data;
          useAdminStats = true;
          console.log('Using admin statistics:', statsData);
        }
      } catch (err) {
        console.log('Admin statistics not available, calculating from loaded data:', err.message);
      }

      // Set final stats
      const finalStats = useAdminStats ? {
        totalUsers: statsData.totalUsers || 0,
        totalTrucks: statsData.totalFoodTrucks || 0,
        totalReviews: statsData.totalReviews || 0,
        activeVendors: statsData.totalVendors || 0
      } : {
        totalUsers: usersData.length,
        totalTrucks: trucksData.length,
        totalReviews: reviewsData.length,
        activeVendors: usersData.filter(u => u.role?.toLowerCase() === 'vendor').length
      };
      
      console.log('Setting final stats:', finalStats);
      setStats(finalStats);
      
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load admin data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFoodTrucks = async () => {
    try {
      console.log('Loading food trucks...');
      
      // Use regular endpoint for now since we know it works
      const response = await apiService.getFoodTrucks(1, 100);
      console.log('Food trucks response:', response);
      
      let trucks = [];
      if (response?.items) {
        trucks = response.items;
      } else if (response?.data) {
        trucks = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        trucks = response;
      }
      
      console.log('Processed trucks:', trucks.length);
      setFoodTrucks(trucks);
      return trucks;
    } catch (err) {
      console.error('Error loading food trucks:', err);
      // Return empty array instead of throwing to prevent the whole load from failing
      setFoodTrucks([]);
      return [];
    }
  };

  const loadUsers = async () => {
    try {
      console.log('Loading users...');
      const response = await apiService.getUsers(1, 100);
      console.log('Users response:', response);
      
      let usersList = [];
      if (response?.items) {
        usersList = response.items;
      } else if (response?.data) {
        usersList = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        usersList = response;
      }
      
      setUsers(usersList);
      return usersList;
    } catch (err) {
      console.error('Error loading users:', err);
      // Return empty array instead of throwing
      setUsers([]);
      return [];
    }
  };

  const loadReviews = async () => {
    try {
      console.log('Loading reviews...');
      const response = await apiService.getAllReviews(1, 100);
      console.log('Reviews response:', response);
      
      let reviewsList = [];
      if (response?.items) {
        reviewsList = response.items;
      } else if (response?.data) {
        reviewsList = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        reviewsList = response;
      }
      
      setReviews(reviewsList);
      return reviewsList;
    } catch (err) {
      console.error('Error loading reviews:', err);
      // Return empty array instead of throwing
      setReviews([]);
      return [];
    }
  };

  const handleDeleteFoodTruck = async (truckId) => {
    try {
      setError('');
      console.log('Deleting food truck:', truckId);
      
      await apiService.deleteFoodTruck(truckId);
      setSuccess('Food truck deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      await loadFoodTrucks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting food truck:', err);
      setError('Failed to delete food truck: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setError('');
      console.log('Deleting user:', userId);
      
      await apiService.deleteUser(userId);
      setSuccess('User deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      await loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user: ' + err.message);
    }
  };

  const handleDeleteReview = async (foodTruckId, reviewId) => {
    try {
      setError('');
      console.log('Deleting review:', reviewId, 'from truck:', foodTruckId);
      
      await apiService.deleteReview(foodTruckId, reviewId);
      setSuccess('Review deleted successfully');
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      // Refresh reviews list
      setReviews(prev => prev.filter(review => review.reviewId !== reviewId));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review: ' + err.message);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleToggleTruckStatus = async (truckId, currentStatus) => {
    try {
      setError('');
      console.log('Toggling truck status:', truckId, currentStatus);
      
      setFoodTrucks(prev => prev.map(truck => 
        truck.foodTruckId === truckId 
          ? { ...truck, isActive: !currentStatus }
          : truck
      ));

      await apiService.adminUpdateFoodTruckStatus(truckId, !currentStatus);
      setSuccess(`Food truck ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating truck status:', err);
      setFoodTrucks(prev => prev.map(truck => 
        truck.foodTruckId === truckId 
          ? { ...truck, isActive: currentStatus }
          : truck
      ));
      setError('Failed to update truck status: ' + err.message);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (!isAdmin) {
      setError('Admin privileges required to modify user status');
      return;
    }

    try {
      setError('');
      console.log('Toggling user status:', userId, currentStatus);
      
      // Optimistically update UI
      setUsers(prev => prev.map(user => 
        user.userId === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));

      await apiService.updateUserStatus(userId, !currentStatus);
      setSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating user status:', err);
      // Revert optimistic update on error
      setUsers(prev => prev.map(user => 
        user.userId === userId 
          ? { ...user, isActive: currentStatus }
          : user
      ));
      setError('Failed to update user status: ' + err.message);
    }
  };

  const openDeleteModal = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'truck' && itemToDelete) {
      handleDeleteFoodTruck(itemToDelete.foodTruckId);
    } else if (deleteType === 'user' && itemToDelete) {
      handleDeleteUser(itemToDelete.userId);
    } else if (deleteType === 'review' && itemToDelete) {
      handleDeleteReview(itemToDelete.foodTruckId, itemToDelete.reviewId);
    }
  };

  const filteredTrucks = foodTrucks.filter(truck =>
    truck.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'appuser': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Remove the access denied block - let users see stats but restrict admin actions
  const isAdmin = hasRole('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/25 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-sky-300/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="animate-slideInLeft">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl mr-6 pulse-glow">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                      Admin Dashboard
                    </span>
                  </h1>
                  <p className="text-xl text-sky-100">
                    Welcome back, {user?.name || user?.userName || 'User'}
                  </p>
                  {!isAdmin && (
                    <p className="text-sm text-yellow-200 bg-yellow-500/20 px-3 py-1 rounded-full mt-2 inline-block">
                      ⚠️ Limited Access - Admin login required for full functionality
                    </p>
                  )}
                </div>
              </div>
              <p className="text-lg text-sky-100 max-w-2xl leading-relaxed">
                {isAdmin 
                  ? "Manage the platform with comprehensive tools for users, food trucks, and system oversight."
                  : "View system statistics and overview. Admin login required for management features."
                }
              </p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4 animate-slideInRight">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Shield className="w-12 h-12 text-white animate-float" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Settings className="w-12 h-12 text-white animate-float" style={{animationDelay: '1s'}} />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Database className="w-12 h-12 text-white animate-float" style={{animationDelay: '2s'}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-xl animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-1">System Alert</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button 
                onClick={() => setError('')} 
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <p className="text-green-700">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">System Statistics</h2>
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Food Trucks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTrucks}</p>
              </div>
              <Truck className="w-8 h-8 text-sky-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeVendors}</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'trucks', 'users', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab} 
                  {tab === 'trucks' && ` (${filteredTrucks.length})`}
                  {tab === 'users' && ` (${filteredUsers.length})`}
                  {tab === 'reviews' && ` (${reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-sky-400" />
                        Quick Stats
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Food Trucks</span>
                          <span className="text-sm font-medium text-gray-900">
                            {foodTrucks.filter(t => t.isActive).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Inactive Trucks</span>
                          <span className="text-sm font-medium text-gray-900">
                            {foodTrucks.filter(t => !t.isActive).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Users</span>
                          <span className="text-sm font-medium text-gray-900">{users.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">System Status</span>
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Operational
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-sky-400" />
                        Recent Activity
                      </h4>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          System loaded successfully
                        </div>
                        <div className="text-sm text-gray-600">
                          {foodTrucks.length} food trucks found
                        </div>
                        <div className="text-sm text-gray-600">
                          {users.length} users registered
                        </div>
                        <div className="text-sm text-gray-600">
                          {reviews.length} reviews collected
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trucks' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Food Trucks Management</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search trucks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={loadAllData}
                      className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {filteredTrucks.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No food trucks match your search' : 'No food trucks found'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Truck</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTrucks.map((truck) => (
                          <tr key={truck.foodTruckId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-sky-400 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{truck.name || 'Unnamed Truck'}</div>
                                  <div className="text-sm text-gray-500">ID: {truck.foodTruckId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {truck.cuisine || 'Not specified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                truck.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {truck.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {truck.latitude && truck.longitude ? (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {truck.latitude.toFixed(4)}, {truck.longitude.toFixed(4)}
                                </div>
                              ) : 'No location'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => window.open(`/food-trucks/${truck.foodTruckId}`, '_blank')}
                                  className="text-sky-600 hover:text-sky-900 p-2 rounded hover:bg-sky-50 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleTruckStatus(truck.foodTruckId, truck.isActive)}
                                  className={`p-2 rounded transition-colors ${
                                    truck.isActive 
                                      ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                      : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                  }`}
                                  title={truck.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  {truck.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => openDeleteModal(truck, 'truck')}
                                  className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
                                  title="Delete Food Truck"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Users Management</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={loadAllData}
                      className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {userSearchTerm ? 'No users match your search' : 'No users found. Make sure your backend has user endpoints configured.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                      {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {isAdmin && (
                                  <button
                                    onClick={() => handleToggleUserStatus(user.userId, user.isActive)}
                                    className={`p-2 rounded transition-colors ${
                                      user.isActive 
                                        ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                    }`}
                                    title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                  >
                                    {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                  </button>
                                )}
                                {isAdmin && user.userId !== user?.userId && (
                                  <button
                                    onClick={() => openDeleteModal(user, 'user')}
                                    className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                {!isAdmin && (
                                  <span className="text-xs text-gray-400 italic">Admin access required</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Reviews Management</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews found. Make sure your backend has review endpoints configured.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{review.userName}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                            <button
                              onClick={() => openDeleteModal({ ...review, name: `Review by ${review.userName}` }, 'review')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">For: {review.truckName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white p-5 border shadow-lg rounded-md max-w-md w-full mx-4">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete {deleteType === 'truck' ? 'Food Truck' : deleteType === 'user' ? 'User' : 'Review'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <strong>"{itemToDelete?.name}"</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;