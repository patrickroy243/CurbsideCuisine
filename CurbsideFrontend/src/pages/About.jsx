import { MapPin, Users, Truck, Target, Heart, Award, Sparkles, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-about-styles]')) {
    styleSheet.setAttribute('data-about-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const About = () => {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    totalUsers: 0,
    totalReviews: 0,
    activeVendors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Try to get admin statistics first
      try {
        const statsResponse = await apiService.getAdminStatistics();
        if (statsResponse?.success && statsResponse?.data) {
          setStats({
            totalTrucks: statsResponse.data.totalFoodTrucks || 0,
            totalUsers: statsResponse.data.totalUsers || 0,
            totalReviews: statsResponse.data.totalReviews || 0,
            activeVendors: statsResponse.data.totalVendors || 0
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Admin stats not available, loading from public endpoints');
      }

      // Fallback: Load from public endpoints
      const trucksResponse = await apiService.getFoodTrucks(1, 1000);
      let trucks = [];
      if (trucksResponse?.items) {
        trucks = trucksResponse.items;
      } else if (trucksResponse?.data?.items) {
        trucks = trucksResponse.data.items;
      } else if (Array.isArray(trucksResponse?.data)) {
        trucks = trucksResponse.data;
      } else if (Array.isArray(trucksResponse)) {
        trucks = trucksResponse;
      }

      const totalReviews = trucks.reduce((sum, truck) => sum + (truck.totalReviews || 0), 0);

      setStats({
        totalTrucks: trucks.length,
        totalUsers: trucks.length * 15, // Estimate: avg 15 customers per truck
        totalReviews: totalReviews,
        activeVendors: trucks.length
      });
      
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-sky-300/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fadeInUp">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <Truck className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              About Curbside Cuisine
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto leading-relaxed">
              Connecting food lovers with the best mobile eateries in New Zealand
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Our Story */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-sky-100 animate-fadeInUp">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              Our Story
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg leading-relaxed mb-4">
              Curbside Cuisine was born from a simple idea: make it easier for food lovers to discover and enjoy 
              the incredible variety of food trucks in their area. We recognized that while food trucks offer some 
              of the most innovative and delicious food around, finding them can be a challenge.
            </p>
            <p className="text-lg leading-relaxed">
              Our platform brings together food truck vendors and hungry customers in one convenient location. 
              Whether you're looking for your next culinary adventure or you're a food truck owner wanting to 
              reach more customers, Curbside Cuisine is here to help.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              To create a vibrant community where food truck culture thrives, making it easy for customers 
              to discover amazing food and for vendors to grow their businesses.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              To be New Zealand's leading platform for food truck discovery, supporting local businesses 
              and bringing communities together through great food.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              What We Offer
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Locations</h3>
              <p className="text-gray-700">
                Track food trucks in real-time on our interactive map. Never miss your favorite vendor again.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Reviews</h3>
              <p className="text-gray-700">
                Read honest reviews from fellow food enthusiasts and share your own experiences.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vendor Tools</h3>
              <p className="text-gray-700">
                Powerful dashboard for food truck owners to manage their presence and connect with customers.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              {loading ? '...' : stats.totalTrucks > 0 ? `${stats.totalTrucks}+` : '0'}
            </div>
            <div className="text-gray-600 font-semibold">Food Trucks</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-2">
              {loading ? '...' : stats.totalUsers > 0 ? `${stats.totalUsers}+` : '0'}
            </div>
            <div className="text-gray-600 font-semibold">Happy Customers</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent mb-2">
              {loading ? '...' : stats.activeVendors > 0 ? `${stats.activeVendors}+` : '0'}
            </div>
            <div className="text-gray-600 font-semibold">Active Vendors</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent mb-2">
              {loading ? '...' : stats.totalReviews > 0 ? `${stats.totalReviews}+` : '0'}
            </div>
            <div className="text-gray-600 font-semibold">Reviews</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center animate-fadeInUp" style={{animationDelay: '0.8s'}}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers and vendors already using Curbside Cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/food-trucks"
              className="px-8 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Find Food Trucks
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              List Your Truck
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-sky-100 text-center animate-fadeInUp" style={{animationDelay: '0.9s'}}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
