import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter,
  Truck,
  Eye,
  Heart,
  RefreshCw,
  ChevronDown,
  Grid,
  List,
  ArrowRight
} from 'lucide-react';
import apiService from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const pageStyles = `
  @keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .shimmer-loading {
    background: linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px);
    background-size: 200px;
    animation: shimmer 1.5s infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-foodtrucks-styles]')) {
    styleSheet.setAttribute('data-foodtrucks-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const FoodTrucks = () => {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [animatedItems, setAnimatedItems] = useState(new Set());
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchFoodTrucks();
  }, []);

  const fetchFoodTrucks = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching food trucks...');
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
      
      setFoodTrucks(trucks);
    } catch (err) {
      console.error('Error fetching food trucks:', err);
      setError('Failed to load food trucks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uniqueCuisines = [...new Set(foodTrucks.map(truck => truck.cuisine).filter(Boolean))];

  const filteredTrucks = foodTrucks.filter(truck => {
    const matchesSearch = truck.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCuisine = !selectedCuisine || truck.cuisine === selectedCuisine;
    const matchesActiveFilter = !showActiveOnly || truck.isActive;
    
    return matchesSearch && matchesCuisine && matchesActiveFilter;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('');
    setShowActiveOnly(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            if (index) {
              setTimeout(() => {
                setAnimatedItems(prev => new Set([...prev, parseInt(index)]));
              }, parseInt(index) * 100);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('[data-animate]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [filteredTrucks]);

  const sortedTrucks = [...filteredTrucks].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'cuisine':
        return (a.cuisine || '').localeCompare(b.cuisine || '');
      case 'name':
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-sky-200 to-blue-200 rounded shimmer-loading w-48 mx-auto"></div>
              <div className="h-3 bg-gradient-to-r from-sky-100 to-blue-100 rounded shimmer-loading w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-sky-300/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 animate-float">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <span className="text-white">Food Trucks</span>
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              Find the best street food near you. Fresh ingredients, authentic flavors, and unforgettable experiences await.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 px-6 py-4 text-gray-900 rounded-xl border-0 shadow-lg focus:ring-4 focus:ring-white/25 transition-all duration-200 bg-white/95 backdrop-blur-sm"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-lg animate-fadeInUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-1">Connection Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchFoodTrucks}
                className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8 animate-fadeInUp">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Food Trucks</label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, cuisine, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cuisine Type</label>
              <div className="relative">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all duration-200 text-gray-900 shadow-sm appearance-none"
                >
                  <option value="">All Cuisines</option>
                  {uniqueCuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-sky-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all duration-200 text-gray-900 shadow-sm appearance-none"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="cuisine">Cuisine</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">View</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center flex-1 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-sky-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center flex-1 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-sky-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center bg-sky-50 rounded-lg px-3 py-2 border border-sky-200">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="mr-2 text-sky-500 focus:ring-sky-300 rounded"
                />
                <span className="text-sm font-medium text-sky-700">Active Only</span>
              </label>
              
              {(searchTerm || selectedCuisine || showActiveOnly) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">
                {sortedTrucks.length} of {foodTrucks.length} trucks
              </span>
              <button
                onClick={fetchFoodTrucks}
                className="flex items-center text-sky-500 hover:text-sky-600 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {sortedTrucks.length === 0 ? (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm || selectedCuisine || showActiveOnly 
                  ? 'No matching food trucks' 
                  : 'No food trucks available'
                }
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {searchTerm || selectedCuisine || showActiveOnly
                  ? 'Try adjusting your search criteria or filters to find more options.'
                  : 'New food trucks are being added regularly. Check back soon!'
                }
              </p>
              {(searchTerm || selectedCuisine || showActiveOnly) && (
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }`}>
            {sortedTrucks.map((truck, index) => (
              <div
                key={truck.foodTruckId}
                data-animate
                data-index={index}
                className={`${
                  animatedItems.has(index) ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <FoodTruckCard 
                  truck={truck} 
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FoodTruckCard = ({ truck, viewMode = 'grid' }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await apiService.isFavorite(truck.foodTruckId);
        if (response?.success) {
          setIsFavorited(response.data);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [truck.foodTruckId]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      addNotification('Please log in to add favorites', 'info');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        const response = await apiService.removeFromFavorites(truck.foodTruckId);
        if (response?.success) {
          setIsFavorited(false);
          addNotification(`${truck.name || 'Food truck'} removed from favorites`, 'success');
        }
      } else {
        const response = await apiService.addToFavorites(truck.foodTruckId);
        if (response?.success) {
          setIsFavorited(true);
          addNotification(`${truck.name || 'Food truck'} added to favorites! ❤️`, 'success');
        }
      }
    } catch (error) {
      addNotification('Failed to update favorites', 'error');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          <div className={`w-48 h-40 relative flex-shrink-0 overflow-hidden ${truck.imageUrl ? '' : 'bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500'}`}>
            {truck.imageUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${apiService.getImageUrl(truck.imageUrl)})`
                }}
              ></div>
            )}

            {!truck.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Truck className={`w-12 h-12 text-white transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorited 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/90 text-gray-600 hover:bg-white shadow-md'
                } ${favoriteLoading ? 'opacity-50' : 'hover:scale-110'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                truck.isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {truck.isActive ? '● ACTIVE' : '● INACTIVE'}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{truck.name || 'Unnamed Food Truck'}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {getRatingStars(truck.averageRating)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({truck.averageRating ? truck.averageRating.toFixed(1) : 'N/A'})
                  </span>
                </div>
              </div>
              {truck.cuisine && (
                <span className="px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm font-semibold shadow-sm">
                  {truck.cuisine}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {truck.description || 'Delicious food truck serving fresh and tasty meals with authentic flavors.'}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-sky-500" />
                  <span>Location Available</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-sky-500" />
                  <span className={truck.isOpen ? 'text-green-600' : 'text-red-500'}>
                    {truck.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
              
              <Link
                to={`/food-trucks/${truck.foodTruckId}`}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-52 relative overflow-hidden ${truck.imageUrl ? '' : 'bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500'}`}>
        {truck.imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${apiService.getImageUrl(truck.imageUrl)})`
            }}
          ></div>
        )}
        {!truck.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <Truck className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`p-3 rounded-full transition-all duration-200 backdrop-blur-sm shadow-lg ${
              isFavorited 
                ? 'bg-red-500/90 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white'
            } ${favoriteLoading ? 'opacity-50' : 'hover:scale-110'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
            truck.isActive 
              ? 'bg-green-500/90 text-white' 
              : 'bg-gray-600/90 text-white'
          }`}>
            {truck.isActive ? '● ACTIVE' : '● INACTIVE'}
          </div>
        </div>

        <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full blur-sm animate-float"></div>
        <div className="absolute bottom-8 right-8 w-6 h-6 bg-white/15 rounded-full blur-sm animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
              {truck.name || 'Unnamed Food Truck'}
            </h3>
            <div className="flex items-center gap-1 mb-3">
              {getRatingStars(truck.averageRating)}
              <span className="text-sm text-gray-500 ml-2 font-medium">
                {truck.averageRating ? truck.averageRating.toFixed(1) : 'New'}
              </span>
            </div>
          </div>
        </div>

        {truck.cuisine && (
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 rounded-full text-sm font-semibold shadow-sm">
              🍽️ {truck.cuisine}
            </span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {truck.description || 'Experience delicious street food crafted with fresh ingredients and authentic recipes that bring amazing flavors right to your neighborhood.'}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-sky-500" />
            <span>Location Available</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-sky-500" />
            <span className={`font-medium ${truck.isOpen ? 'text-green-600' : 'text-red-500'}`}>
              {truck.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>

        <Link
          to={`/food-trucks/${truck.foodTruckId}`}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold group"
        >
          <span>Explore Menu & Details</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FoodTrucks;