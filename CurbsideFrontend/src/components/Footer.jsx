import { Link } from 'react-router-dom';
import { Truck, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-sky-50 to-blue-100 border-t-2 border-gradient-to-r from-sky-200 to-blue-300 shadow-lg">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img 
                  src="/images/CurbsideLogo.png" 
                  alt="Curbside Cuisine Logo" 
                  className="h-10 w-10 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Curbside Cuisine</span>
            </div>
            <p className="text-gray-700 font-medium leading-relaxed">
              Discover the best food trucks in your area. Fresh, local, and delicious meals on wheels.
            </p>
            <div className="flex space-x-4 mt-8">
              <a href="#" className="p-3 bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600 hover:from-sky-500 hover:to-blue-600 hover:text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600 hover:from-sky-500 hover:to-blue-600 hover:text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600 hover:from-sky-500 hover:to-blue-600 hover:text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-sky-600 tracking-wider uppercase mb-6 bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/food-trucks" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Food Trucks
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-sky-600 tracking-wider uppercase mb-6 bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">For Business</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  List Your Truck
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Business Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Advertising
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-sky-600 transition-all duration-200 font-medium hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-2 py-1 rounded-lg inline-block">
                  Partner with Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-sky-600 tracking-wider uppercase mb-6 bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-700 font-medium group">
                <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg mr-3 group-hover:from-sky-500 group-hover:to-blue-600 transition-all duration-200">
                  <MapPin className="h-4 w-4 text-sky-600 group-hover:text-white" />
                </div>
                Invercargill, New Zealand
              </li>
              <li className="flex items-center text-gray-700 font-medium group">
                <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg mr-3 group-hover:from-sky-500 group-hover:to-blue-600 transition-all duration-200">
                  <Phone className="h-4 w-4 text-sky-600 group-hover:text-white" />
                </div>
                (+64) 225064062
              </li>
              <li className="flex items-center text-gray-700 font-medium group">
                <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg mr-3 group-hover:from-sky-500 group-hover:to-blue-600 transition-all duration-200">
                  <Mail className="h-4 w-4 text-sky-600 group-hover:text-white" />
                </div>
                CurbsideCuisine@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-gradient-to-r from-sky-200 via-blue-300 to-sky-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 font-medium bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              © 2025 Curbside Cuisine. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 mt-6 md:mt-0">
              <Link to="/privacy" className="text-gray-600 hover:text-sky-600 font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-3 py-2 rounded-lg">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-sky-600 font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-3 py-2 rounded-lg">
                Terms of Service
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-sky-600 font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 px-3 py-2 rounded-lg">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;