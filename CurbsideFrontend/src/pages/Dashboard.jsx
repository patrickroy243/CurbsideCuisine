import { useState, useEffect } from 'react';
import { useAuth } from '../Root';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  Star, 
  MapPin, 
  TrendingUp, 
  Calendar,
  Settings,
  Plus,
  Edit,
  Eye,
  Navigation,
  Heart,
  BarChart3,
  Activity,
  Zap,
  Award,
  Target,
  Sparkles,
  Crown,
  X,
  XCircle,
  AlertCircle
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
  if (!document.head.querySelector('[data-dashboard-styles]')) {
    styleSheet.setAttribute('data-dashboard-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFoodTrucks, setShowFoodTrucks] = useState(true);
  const [addingTruck, setAddingTruck] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    console.log('Dashboard - User object:', user);
    console.log('Dashboard - User role:', user?.role);
    console.log('Dashboard - User roles:', user?.roles);
    console.log('Dashboard - hasRole admin:', hasRole('admin'));
    console.log('Dashboard - hasRole vendor:', hasRole('vendor'));
    console.log('Dashboard - hasRole customer:', hasRole('customer'));
    console.log('Dashboard - hasRole appuser:', hasRole('appuser'));
  }, [user, hasRole]);
  
  const [newTruck, setNewTruck] = useState({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    website: '',
    latitude: '',
    longitude: '',
    locationName: '',
    isActive: true,
    isOpen: false
  });

  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalReviews: 0,
    averageRating: 0,
    totalViews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setGettingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const locationName = await getReverseGeocode(latitude, longitude);
          
          setNewTruck(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationName: locationName
          }));
          
          setGettingLocation(false);
        } catch (error) {
          console.error('Error getting location name:', error);
          setNewTruck(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      options
    );
  };

  const getReverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.locality 
          ? `${data.locality}, ${data.principalSubdivision}` 
          : `${data.city || data.principalSubdivision}, ${data.countryName}`;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const fetchUserFoodTrucks = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching food trucks for user:', user);
      const response = await apiService.getFoodTrucks(1, 100);
      console.log('Dashboard API response:', response);
      
      let trucks = [];
      if (response?.data?.items) {
        trucks = response.data.items;
      } else if (response?.items) {
        trucks = response.items;
      } else if (response?.data && Array.isArray(response.data)) {
        trucks = response.data;
      } else if (Array.isArray(response)) {
        trucks = response;
      }
      
      if (hasRole('admin')) {
        setFoodTrucks(trucks);
      } else if (hasRole('vendor')) {
        const userTrucks = trucks.filter(truck => 
          truck.ownerId === user?.userId || 
          truck.ownerId === user?.id ||
          truck.ownerName === user?.userName
        );
        setFoodTrucks(userTrucks);
      } else {
        setFoodTrucks([]);
      }

      const safeTrucks = trucks || [];
      setStats({
        totalTrucks: safeTrucks.length,
        totalReviews: safeTrucks.reduce((sum, truck) => sum + (truck.totalReviews || 0), 0),
        averageRating: safeTrucks.length > 0 
          ? (safeTrucks.reduce((sum, truck) => sum + (truck.averageRating || 0), 0) / safeTrucks.length)
          : 0,
        totalViews: safeTrucks.reduce((sum, truck) => sum + (truck.totalViews || 0), 0)
      });

    } catch (err) {
      console.error('Error fetching food trucks:', err);
      setError('Failed to load your food trucks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTruck = async (e) => {
    e.preventDefault();
    setAddingTruck(true);
    setError('');

    if (!newTruck.latitude || !newTruck.longitude) {
      setError('Please get your current location first');
      setAddingTruck(false);
      return;
    }

    try {
      const truckData = {
        ...newTruck,
        latitude: parseFloat(newTruck.latitude) || 0,
        longitude: parseFloat(newTruck.longitude) || 0,
        ownerId: user?.userId || user?.id
      };

      console.log('Creating truck with data:', truckData);
      await apiService.createFoodTruck(truckData);
      
      setNewTruck({
        name: '',
        description: '',
        cuisine: '',
        phone: '',
        website: '',
        latitude: '',
        longitude: '',
        locationName: '',
        isActive: true,
        isOpen: false
      });
      setShowAddModal(false);
      setLocationError('');
      
      fetchUserFoodTrucks();
    } catch (err) {
      setError(err.message || 'Failed to create food truck');
      console.error('Error creating food truck:', err);
    } finally {
      setAddingTruck(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTruck(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditTruck = (truckId) => {
    navigate(`/food-trucks/${truckId}/edit`);
  };

  const handleViewTruck = (truckId) => {
    navigate(`/food-trucks/${truckId}`);
  };

  const toggleTruckStatus = async (truckId, currentStatus) => {
    try {
      console.log('Toggling truck status:', { truckId, currentStatus, newStatus: !currentStatus });
      setError(''); 
   
      await apiService.updateFoodTruckStatus(truckId, !currentStatus);
      
      console.log('Successfully updated truck status on server');
      setFoodTrucks(prevTrucks => 
        prevTrucks.map(truck => 
          (truck.foodTruckId || truck.id) === truckId 
            ? { ...truck, isOpen: !currentStatus }
            : truck
        )
      );
      
      
    } catch (err) {
      setError('Failed to update truck status: ' + err.message);
      console.error('Error updating truck status:', err);
    }
  };

  useEffect(() => {
    if (user) {
      if (hasRole('vendor') || hasRole('admin')) {
        fetchUserFoodTrucks();
      } else {
        fetchUserStats();
      }
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getDashboardStats();
      console.log('Dashboard stats response:', response);
      
      if (response?.success && response?.data) {
        setStats({
          totalTrucks: response.data.favoriteCount,
          totalReviews: response.data.writtenReviewsCount,
          averageRating: 0,
          totalViews: response.data.visitsCount
        });
        
        const activity = [];
        if (response.data.recentReviews) {
          response.data.recentReviews.forEach(review => {
            activity.push({
              type: 'review',
              title: 'Left a review',
              description: `Reviewed ${review.foodTruckName || 'a food truck'}`,
              time: new Date(review.createdAt).toLocaleDateString(),
              icon: 'star'
            });
          });
        }
        if (response.data.recentFavorites) {
          response.data.recentFavorites.forEach(truck => {
            activity.push({
              type: 'favorite',
              title: 'Added to favorites',
              description: truck.name,
              time: new Date(truck.createdAt).toLocaleDateString(),
              icon: 'heart'
            });
          });
        }
        setRecentActivity(activity.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasRole('admin') || hasRole('vendor')) {
    return (
      <VendorDashboard 
          user={user} 
          navigate={navigate}
          hasRole={hasRole}
          stats={stats} 
          recentActivity={recentActivity}
          foodTrucks={foodTrucks}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          showFoodTrucks={showFoodTrucks}
          setShowFoodTrucks={setShowFoodTrucks}
          newTruck={newTruck}
          handleInputChange={handleInputChange}
          handleAddTruck={handleAddTruck}
          handleEditTruck={handleEditTruck}
          handleViewTruck={handleViewTruck}
          toggleTruckStatus={toggleTruckStatus}
          addingTruck={addingTruck}
          gettingLocation={gettingLocation}
          getCurrentLocation={getCurrentLocation}
          locationError={locationError}
          error={error}
        />
    );
  }

  return (
    <>
      <CustomerDashboard user={user} navigate={navigate} />
    </>
  );
};

const CustomerDashboard = ({ user, navigate }) => {
  const [userStats, setUserStats] = useState({
    favoriteCount: 0,
    writtenReviewsCount: 0,
    visitsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboardStats();
      console.log('Customer dashboard stats response:', response);
      
      if (response?.success && response?.data) {
        setUserStats({
          favoriteCount: response.data.favoriteCount,
          writtenReviewsCount: response.data.writtenReviewsCount,
          visitsCount: response.data.visitsCount
        });
        
        const activity = [];
        if (response.data.recentReviews) {
          response.data.recentReviews.forEach(review => {
            activity.push({
              type: 'review',
              title: 'Left a review',
              description: `Reviewed ${review.foodTruckName || 'a food truck'}`,
              time: new Date(review.createdAt).toLocaleDateString(),
              icon: 'star'
            });
          });
        }
        if (response.data.recentFavorites) {
          response.data.recentFavorites.forEach(truck => {
            activity.push({
              type: 'favorite',
              title: 'Added to favorites',
              description: truck.name,
              time: new Date(truck.createdAt).toLocaleDateString(),
              icon: 'heart'
            });
          });
        }
        setRecentActivity(activity.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching customer dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 animate-float pulse-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeInUp">
              <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                Welcome back,
              </span>
              <br />
              <span className="text-white">{user?.name || user?.userName}!</span>
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Your food truck adventure continues. Discover, taste, and explore the best street food in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <button 
                onClick={() => navigate('/food-trucks')} 
                className="px-8 py-4 bg-white text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Food Trucks
              </button>
              <button 
                onClick={() => navigate('/map')} 
                className="px-8 py-4 bg-sky-500/20 border border-white/20 text-white rounded-xl font-semibold hover:bg-sky-500/30 transition-all duration-200 backdrop-blur-sm"
              >
                View Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-sky-200 to-blue-200 rounded shimmer-loading w-48 mx-auto"></div>
              <div className="h-3 bg-gradient-to-r from-sky-100 to-blue-100 rounded shimmer-loading w-32 mx-auto"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInLeft" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">Favorites</h3>
                      <p className="text-sm text-gray-500">Food trucks you love</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-red-500 mb-1">{userStats.favoriteCount}</p>
                    <p className="text-sm text-gray-600">
                      {userStats.favoriteCount > 0 ? 'Keep exploring!' : 'Start adding favorites'}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center animate-float">
                    <Heart className="w-8 h-8 text-red-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
                      <p className="text-sm text-gray-500">Your contributions</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-orange-500 mb-1">{userStats.writtenReviewsCount}</p>
                    <p className="text-sm text-gray-600">
                      {userStats.writtenReviewsCount > 0 ? 'Thanks for sharing!' : 'Share your experiences'}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '2s'}}>
                    <Star className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slideInRight" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">Visits</h3>
                      <p className="text-sm text-gray-500">Places discovered</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-bold text-emerald-500 mb-1">{userStats.visitsCount}</p>
                    <p className="text-sm text-gray-600">
                      {userStats.visitsCount > 0 ? 'Great explorer!' : 'Start your journey'}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '4s'}}>
                    <MapPin className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="p-6 border-b border-sky-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => navigate('/food-trucks')}
                className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group w-full text-left"
              >
                <Truck className="w-6 h-6 text-sky-400 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-sky-700">Browse Food Trucks</h3>
                  <p className="text-sm text-gray-600">Discover new food trucks in your area</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/map')}
                className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group w-full text-left"
              >
                <MapPin className="w-6 h-6 text-sky-400 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-sky-700">View Map</h3>
                  <p className="text-sm text-gray-600">Find food trucks near you on the interactive map</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group w-full text-left"
              >
                <Settings className="w-6 h-6 text-sky-400 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-sky-700">Update Profile</h3>
                  <p className="text-sm text-gray-600">Manage your account settings and preferences</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="p-6 border-b border-sky-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center p-3 bg-sky-50 rounded-lg">
                      <div className="flex-shrink-0 mr-3">
                        {activity.icon === 'star' ? (
                          <Star className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Heart className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No recent activity</p>
                  <p className="text-sm text-gray-400 mb-6">Start exploring food trucks to see your activity here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VendorDashboard = ({ 
  user, 
  navigate,
  hasRole,
  stats, 
  recentActivity, 
  foodTrucks, 
  showAddModal, 
  setShowAddModal,
  showFoodTrucks,
  setShowFoodTrucks, 
  newTruck, 
  handleInputChange, 
  handleAddTruck, 
  handleEditTruck,
  handleViewTruck,
  toggleTruckStatus,
  addingTruck,
  gettingLocation,
  getCurrentLocation,
  locationError,
  error 
}) => {
  const safeStats = stats || {
    totalTrucks: 0,
    totalReviews: 0,
    averageRating: 0,
    totalViews: 0
  };
  const safeFoodTrucks = foodTrucks || [];
  const safeRecentActivity = recentActivity || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-200/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-8 lg:mb-0 animate-fadeInUp">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-2xl backdrop-blur-sm mr-4 pulse-glow">
                  {user?.role === 'admin' ? '👑' : '🚚'}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Welcome back, {user?.name || user?.userName}!
                  </h1>
                  <div className="flex items-center">
                    {hasRole('admin') && (
                      <span className="bg-yellow-400/90 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mr-3 flex items-center">
                        <Crown className="w-4 h-4 mr-1" />
                        Administrator
                      </span>
                    )}
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {hasRole('admin') ? 'Platform Manager' : 'Food Truck Owner'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xl text-sky-100 max-w-2xl">
                {hasRole('admin') 
                  ? 'Oversee the entire platform and manage all food truck operations'
                  : 'Manage your food truck business and delight customers'
                }
              </p>
            </div>

            <div className="animate-slideInRight">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white/95 backdrop-blur-sm text-sky-600 px-8 py-4 rounded-2xl hover:bg-white hover:scale-105 transition-all duration-300 font-semibold flex items-center shadow-2xl hover:shadow-3xl"
              >
                <Plus className="w-6 h-6 mr-3" />
                Add New Food Truck
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 bg-red-50/80 border border-red-200 text-red-700 px-6 py-4 rounded-2xl backdrop-blur-sm flex items-center animate-slideInLeft">
            <XCircle className="w-6 h-6 mr-3 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-fadeInUp">
          {(hasRole('vendor') || hasRole('admin')) ? (
            <>
              <div className="group bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Food Trucks</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{safeFoodTrucks.length}</p>
                  </div>
                </div>
                <div className="flex items-center text-emerald-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Active Operations</span>
                </div>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Reviews</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{safeStats.totalReviews}</p>
                  </div>
                </div>
                <div className="flex items-center text-amber-600">
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  <span className="font-semibold">
                    {(typeof safeStats.averageRating === 'number' && safeStats.averageRating > 0) 
                      ? safeStats.averageRating.toFixed(1) 
                      : '0.0'
                    } Avg Rating
                  </span>
                </div>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customers</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{safeStats.totalCustomers || 0}</p>
                  </div>
                </div>
                <div className="flex items-center text-emerald-600">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Active Users</span>
                </div>
              </div>

              <div className="group bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Views</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{safeStats.totalViews || 0}</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-600">
                  <Activity className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Across All Trucks</span>
                </div>
              </div>
            </>
          ) : (
            <>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slideInUp">
          <div className="lg:col-span-2 space-y-8">
            {showFoodTrucks && (
              <div className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <Truck className="w-8 h-8 mr-3" />
                        Your Food Trucks
                      </h2>
                      <p className="text-sky-100 mt-1">Manage and monitor your fleet</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 font-semibold flex items-center hover:scale-105"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Truck
                      </button>
                      <button 
                        onClick={() => setShowFoodTrucks(false)}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
                        title="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              <div className="p-6">
                {safeFoodTrucks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-10 h-10 text-sky-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No food trucks yet</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first food truck</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Plus className="w-5 h-5 inline-block mr-2" />
                      Add Your First Truck
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {safeFoodTrucks.map((truck, index) => (
                      <div 
                        key={truck.foodTruckId || truck.id} 
                        className="bg-gradient-to-br from-white to-sky-50 border border-sky-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp group"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-700 transition-colors">
                              {truck.name || 'Unnamed Truck'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{truck.cuisine || 'Cuisine not specified'}</p>
                            <p className="text-xs text-gray-500">{truck.description || 'No description available'}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            truck.isOpen 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {truck.isOpen ? 'Open' : 'Closed'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleViewTruck(truck.foodTruckId || truck.id)}
                              className="p-3 text-sky-600 hover:bg-sky-100 rounded-xl transition-all duration-300 hover:scale-110"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditTruck(truck.foodTruckId || truck.id)}
                              className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-110"
                              title="Edit Truck"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => toggleTruckStatus(truck.foodTruckId || truck.id, truck.isOpen)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                              truck.isOpen 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {truck.isOpen ? 'Close' : 'Open'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>
            )}

            {!showFoodTrucks && (
              <div className="bg-white/90 backdrop-blur-sm border border-sky-100 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-4">
                  <button 
                    onClick={() => setShowFoodTrucks(true)}
                    className="flex items-center text-white hover:text-sky-100 transition-colors w-full"
                  >
                    <Truck className="w-6 h-6 mr-3" />
                    <span className="font-semibold">Show Your Food Trucks</span>
                    <Plus className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {safeRecentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    <p className="text-sm text-gray-400 mb-6">Your recent activities will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {safeRecentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-sky-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-sky-400 rounded-lg flex items-center justify-center mr-3">
                            {activity.type === 'review' ? (
                              <Star className="w-5 h-5 text-white" />
                            ) : activity.type === 'view' ? (
                              <Eye className="w-5 h-5 text-white" />
                            ) : (
                              <MapPin className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <button
                  onClick={() => navigate('/food-trucks')}
                  className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group w-full text-left"
                >
                  <Truck className="w-6 h-6 text-sky-400 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-sky-700">Browse Food Trucks</h3>
                    <p className="text-sm text-gray-600">See what's in your area</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/map')}
                  className="flex items-center p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors group w-full text-left"
                >
                  <MapPin className="w-6 h-6 text-sky-400 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-sky-700">View Map</h3>
                    <p className="text-sm text-gray-600">See all food trucks on the map</p>
                  </div>
                </button>

{hasRole('admin') && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg hover:from-yellow-100 hover:to-amber-100 transition-all duration-300 group w-full text-left shadow-sm hover:shadow-md border border-yellow-200"
                  >
                    <Crown className="w-6 h-6 text-yellow-600 mr-4 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-yellow-700">Admin Panel</h3>
                      <p className="text-sm text-gray-600">Full system administration</p>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg hover:from-gray-100 hover:to-slate-100 transition-all duration-300 group w-full text-left shadow-sm hover:shadow-md"
                >
                  <Settings className="w-6 h-6 text-gray-500 mr-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700">Update Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Food Truck</h3>
              
              <form onSubmit={handleAddTruck} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newTruck.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    value={newTruck.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                  <input
                    type="text"
                    name="cuisine"
                    required
                    value={newTruck.cuisine}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newTruck.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="555-0123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                  <input
                    type="url"
                    name="website"
                    value={newTruck.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="w-full flex items-center justify-center px-4 py-2 bg-sky-100 text-sky-700 border border-sky-300 rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                    >
                      {gettingLocation ? (
                        <>
                          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4 mr-2" />
                          Get My Current Location
                        </>
                      )}
                    </button>

                    {locationError && (
                      <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {locationError}
                      </div>
                    )}

                    {newTruck.locationName && (
                      <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="font-medium">Current Location:</span>
                        </div>
                        <p className="mt-1">{newTruck.locationName}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Coordinates: {parseFloat(newTruck.latitude).toFixed(6)}, {parseFloat(newTruck.longitude).toFixed(6)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={newTruck.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Active</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isOpen"
                      checked={newTruck.isOpen}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Open Now</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingTruck || !newTruck.latitude || !newTruck.longitude}
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                  >
                    {addingTruck ? 'Creating...' : 'Create Food Truck'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default Dashboard;
