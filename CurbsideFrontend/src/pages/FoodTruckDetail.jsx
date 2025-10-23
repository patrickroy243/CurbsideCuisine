import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Root';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Clock, 
  ArrowLeft,
  DollarSign,
  MessageSquare,
  Users,
  Award,
  ChefHat,
  Edit3,
  ExternalLink,
  Calendar,
  Plus,
  X,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Heart,
  Truck
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
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-detail-styles]')) {
    styleSheet.setAttribute('data-detail-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const FoodTruckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  
  const [truck, setTruck] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    fetchFoodTruck();
    fetchMenuItems();
    fetchReviews();
  }, [id]);

  const fetchFoodTruck = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFoodTruckById(id);
      
      let truckData;
      if (response?.data) {
        truckData = response.data;
      } else if (response) {
        truckData = response;
      }

      setTruck(truckData);
    } catch (err) {
      console.error('Error fetching food truck:', err);
      setError('Failed to load food truck details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await apiService.getMenuItems(id);
      
      let items = [];
      if (response?.data?.items) {
        items = response.data.items;
      } else if (response?.items) {
        items = response.items;
      } else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (Array.isArray(response)) {
        items = response;
      }
      
      setMenuItems(items);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await apiService.getReviews(id);
      
      let reviewsData = [];
      if (response?.data?.items) {
        reviewsData = response.data.items;
      } else if (response?.items) {
        reviewsData = response.items;
      } else if (response?.data && Array.isArray(response.data)) {
        reviewsData = response.data;
      } else if (Array.isArray(response)) {
        reviewsData = response;
      }
      
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification('Please log in to add a review', 'error');
      return;
    }
    if (newReview.rating === 0) {
      showNotification('Please select a rating', 'error');
      return;
    }

    setSubmitLoading(true);
    try {
      await apiService.createReview(id, {
        rating: newReview.rating,
        comment: newReview.comment.trim()
      });

      setNewReview({ rating: 0, comment: '' });
      setShowAddReview(false);
      
      await Promise.all([fetchReviews(), fetchFoodTruck()]);
      
      showNotification('Review added successfully!', 'success');
    } catch (error) {
      console.error('Error adding review:', error);
      showNotification('Failed to add review: ' + error.message, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderInteractiveStars = (currentRating, onRate, onHover, onLeave) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRate(i + 1)}
        onMouseEnter={() => onHover(i + 1)}
        onMouseLeave={onLeave}
        className="p-1 focus:outline-none"
      >
        <Star
          className={`w-8 h-8 transition-colors ${
            i < currentRating
              ? 'text-amber-400 fill-current'
              : 'text-gray-300 hover:text-amber-200'
          }`}
        />
      </button>
    ));
  };

  const groupMenuByCategory = (items) => {
    const grouped = {};
    items.forEach(item => {
      const category = item.category || 'Featured Items';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating || 0)
            ? 'text-amber-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !truck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-xl p-10 max-w-md border border-sky-200 backdrop-blur-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-red-700 font-bold mb-6 text-lg">{error || 'Restaurant not found'}</p>
          <button
            onClick={() => navigate('/food-trucks')}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const groupedMenu = groupMenuByCategory(menuItems.filter(item => item.isAvailable !== false));
  const averageRating = truck.averageRating || 0;
  const totalReviews = truck.totalReviews || reviews.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full">
          <div className={`p-4 rounded-xl shadow-xl border-2 flex items-start space-x-3 backdrop-blur-sm ${
            notification.type === 'success' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 text-green-800' 
              : notification.type === 'error'
              ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300 text-red-800'
              : 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-300 text-sky-800'
          }`}>
            <div className="flex-shrink-0 pt-0.5">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
              {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={hideNotification}
              className={`flex-shrink-0 p-1 rounded-md hover:bg-opacity-20 transition-colors ${
                notification.type === 'success' 
                  ? 'hover:bg-green-600' 
                  : notification.type === 'error'
                  ? 'hover:bg-red-600'
                  : 'hover:bg-blue-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-white via-sky-50 to-blue-50 border-b-2 border-sky-200 sticky top-0 z-40 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/food-trucks')}
            className="flex items-center text-gray-600 hover:text-sky-700 transition-all duration-200 group bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-4 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Restaurants</span>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {truck.imageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${apiService.getImageUrl(truck.imageUrl)})`
            }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-700"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <div className={`flex items-center px-6 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border-2 ${
                  truck.isOpen 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                    truck.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {truck.isOpen ? 'Open Now' : 'Currently Closed'}
                </div>
              </div>
              
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {truck.name}
              </h1>
              <p className="text-xl text-sky-100 mb-8 leading-relaxed max-w-2xl font-medium">
                {truck.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="p-3 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl mr-4 shadow-md">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sky-200 font-medium">Cuisine</p>
                    <p className="font-bold text-white text-lg">{truck.cuisine}</p>
                  </div>
                </div>
                
                {averageRating > 0 && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mr-4 shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        {renderStars(averageRating, 'w-4 h-4')}
                      </div>
                      <p className="text-sm text-sky-200 font-medium">
                        {averageRating.toFixed(1)} ({totalReviews} reviews)
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mr-4 shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-sky-200 font-medium">Menu Items</p>
                    <p className="font-bold text-white text-lg">{menuItems.length} dishes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white/95 to-sky-50/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-white/30">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  {truck.phone && (
                    <div className="flex items-center group bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Phone</p>
                        <a 
                          href={`tel:${truck.phone}`} 
                          className="text-gray-900 font-bold hover:text-sky-600 transition-colors text-lg"
                        >
                          {truck.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {truck.website && (
                    <div className="flex items-center group bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 p-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Website</p>
                        <a 
                          href={truck.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-900 font-bold hover:text-sky-600 transition-colors flex items-center text-lg"
                        >
                          Visit Site
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {!truck.phone && !truck.website && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Phone className="w-8 h-8 text-sky-600" />
                      </div>
                      <p className="text-gray-600 font-medium">No contact information available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-xl border-2 border-sky-200 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="flex border-b-2 border-sky-200">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-6 px-8 text-lg font-bold transition-all duration-200 relative ${
                activeTab === 'menu'
                  ? 'text-sky-600 bg-gradient-to-br from-sky-100 to-blue-100'
                  : 'text-gray-600 hover:text-sky-700 hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <ChefHat className="w-5 h-5 mr-2" />
                Menu
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  activeTab === 'menu' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {menuItems.length}
                </span>
              </div>
              {activeTab === 'menu' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-6 px-8 text-lg font-bold transition-all duration-200 relative ${
                activeTab === 'reviews'
                  ? 'text-sky-600 bg-gradient-to-br from-sky-100 to-blue-100'
                  : 'text-gray-600 hover:text-sky-700 hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <Star className="w-5 h-5 mr-2" />
                Reviews
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  activeTab === 'reviews' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {reviews.length}
                </span>
              </div>
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600"></div>
              )}
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'menu' && (
              <div>
                {menuLoading ? (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-6"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Loading menu...</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <ChefHat className="w-12 h-12 text-sky-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Menu Available</h3>
                    <p className="text-gray-600 font-medium">This restaurant hasn't added their menu yet. Check back soon!</p>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {Object.entries(groupedMenu).length === 0 ? (
                      <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Menu Currently Unavailable</h3>
                        <p className="text-slate-500">All items are temporarily unavailable. Please check back later.</p>
                      </div>
                    ) : (
                      Object.entries(groupedMenu).map(([category, items]) => (
                        <div key={category} className="space-y-6">
                          <div className="border-b-2 border-gradient-to-r from-sky-200 to-blue-300 pb-6">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent">{category}</h3>
                            <p className="text-gray-600 mt-2 font-semibold">{items.length} items available</p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {items.map((item) => (
                              <div key={item.menuItemId || item.id} 
                                   className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 hover:from-sky-100 hover:to-blue-100 hover:shadow-xl transition-all duration-300 border-2 border-sky-200 hover:border-sky-300 transform hover:scale-105">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-700 transition-colors">
                                      {item.name}
                                    </h4>
                                    {item.description && (
                                      <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-6 text-right">
                                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-xl flex items-center font-bold text-lg shadow-lg">
                                      <DollarSign className="w-5 h-5" />
                                      {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {user && (
                  <div className="mb-8">
                    <button
                      onClick={() => setShowAddReview(true)}
                      className="flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <Plus className="w-6 h-6 mr-3" />
                      Add Review
                      <Sparkles className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="text-center py-16">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-6"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                      <MessageSquare className="w-12 h-12 text-sky-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reviews Yet</h3>
                    <p className="text-gray-600 font-medium">Be the first to share your experience with this restaurant!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {averageRating > 0 && (
                      <div className="bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 rounded-2xl p-8 border-2 border-sky-200 mb-10 shadow-xl">
                        <div className="text-center">
                          <div className="text-5xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent mb-4">
                            {averageRating.toFixed(1)}
                          </div>
                          <div className="flex items-center justify-center mb-4">
                            {renderStars(averageRating, 'w-8 h-8')}
                          </div>
                          <p className="text-gray-700 font-semibold text-lg">
                            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.reviewId || review.id} 
                             className="bg-gradient-to-br from-white to-sky-50 rounded-2xl p-8 border-2 border-sky-200 hover:shadow-xl transition-all duration-300 hover:border-sky-300 transform hover:scale-105">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
                                <span className="text-white font-bold text-xl">
                                  {(review.userName || 'A').charAt(0).toUpperCase()
                                }</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {review.userName || 'Anonymous User'}
                                </h4>
                                <div className="flex items-center mt-2">
                                  {renderStars(review.rating || 0)}
                                  <span className="ml-3 text-sm text-gray-600 flex items-center font-medium">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {review.createdAt 
                                      ? new Date(review.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })
                                      : 'Recently'
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {review.comment && (
                            <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl p-4 ml-2">
                              <p className="text-gray-800 leading-relaxed font-medium italic">
                                "{review.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {user && truck && (
        (() => {
          try {
            const userRoles = user.roles || user.role || user.userType || [];
            const userRoleStrings = Array.isArray(userRoles) 
              ? userRoles.map(r => typeof r === 'string' ? r.toLowerCase() : (r?.name || r?.roleName || '').toLowerCase())
              : [typeof userRoles === 'string' ? userRoles.toLowerCase() : ''];
            
            const isVendorOrAdmin = userRoleStrings.includes('vendor') || userRoleStrings.includes('admin');
            const isOwner = truck.ownerId === (user?.userId || user?.id);
            
            return isVendorOrAdmin && isOwner && (
              <div className="fixed bottom-8 right-8 z-50">
                <button
                  onClick={() => navigate(`/food-trucks/${id}/edit`)}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-5 rounded-full shadow-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 group pulse-glow"
                  title="Edit Restaurant"
                >
                  <Edit3 className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            );
          } catch (error) {
            console.error('Error checking user permissions:', error);
            return null;
          }
        })()
      )}

      {showAddReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-sky-50 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-sky-200">
            <div className="p-8 border-b-2 border-sky-200">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent">Add Review</h2>
                <button 
                  onClick={() => {
                    setShowAddReview(false);
                    setNewReview({ rating: 0, comment: '' });
                    setHoverRating(0);
                  }}
                  className="p-3 hover:bg-gradient-to-br hover:from-sky-100 hover:to-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-700 mt-3 font-medium">Share your experience with {truck?.name}</p>
            </div>

            <form onSubmit={handleAddReview} className="p-8 space-y-8">
              <div>
                <label className="block text-xl font-bold text-gray-900 mb-4">
                  Your Rating *
                </label>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl p-4">
                  {renderInteractiveStars(
                    hoverRating || newReview.rating,
                    (rating) => setNewReview({ ...newReview, rating }),
                    setHoverRating,
                    () => setHoverRating(0)
                  )}
                  <span className="ml-4 text-gray-700 font-bold text-lg">
                    {hoverRating || newReview.rating ? 
                      `${hoverRating || newReview.rating} star${(hoverRating || newReview.rating) !== 1 ? 's' : ''}` 
                      : 'Select a rating'
                    }
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xl font-bold text-gray-900 mb-4">
                  Your Review (Optional)
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={5}
                  className="w-full px-6 py-4 border-2 border-sky-300 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-500 transition-all duration-200 resize-none bg-gradient-to-br from-white to-sky-50 font-medium"
                  placeholder="Tell others about your experience..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-600 mt-3 font-semibold">
                  {newReview.comment.length}/500 characters
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t-2 border-sky-200">
                <button
                  type="submit"
                  disabled={submitLoading || newReview.rating === 0}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 px-8 rounded-xl hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Submit Review
                      <Heart className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddReview(false);
                    setNewReview({ rating: 0, comment: '' });
                    setHoverRating(0);
                  }}
                  className="flex-1 border-2 border-sky-300 py-4 px-8 rounded-xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 transition-all duration-200 font-bold text-gray-700 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodTruckDetail;