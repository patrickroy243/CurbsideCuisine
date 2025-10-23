import { Link } from 'react-router-dom';
import { MapPin, Search, Star, Users, Clock, ArrowRight, Truck, Heart, Building2, Award, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isVisible, setIsVisible] = useState({});


  const features = [
    {
      icon: MapPin,
      title: "Find Nearby Trucks",
      description: "Discover food trucks in your area with real-time locations and hours.",
      gradient: "from-blue-500 to-sky-500"
    },
    {
      icon: Search,
      title: "Browse by Cuisine",
      description: "Filter by your favorite cuisines and dietary preferences.",
      gradient: "from-sky-500 to-cyan-500"
    },
    {
      icon: Star,
      title: "Read Reviews",
      description: "Check ratings and reviews from fellow food lovers.",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get live updates on locations, menus, and operating hours.",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const howItWorks = [
    { 
      icon: Search, 
      title: "Discover", 
      description: "Browse food trucks near you or search by cuisine type",
      step: "01"
    },
    { 
      icon: MapPin, 
      title: "Locate", 
      description: "View real-time locations and operating hours on the map",
      step: "02"
    },
    { 
      icon: Star, 
      title: "Choose", 
      description: "Read reviews and ratings to find your perfect meal",
      step: "03"
    },
    { 
      icon: Heart, 
      title: "Enjoy", 
      description: "Visit your chosen food truck and savor amazing food",
      step: "04"
    }
  ];



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);



  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-white opacity-10 animate-float`}
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            />
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
              {[...Array(144)].map((_, i) => (
                <div key={i} className="bg-white rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <img 
              src="/images/CurbsideLogo.png" 
              alt="Curbside Logo Background" 
              className="w-96 h-96 md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] object-contain opacity-20 animate-slow-spin"
            />
            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <div className="space-y-4 mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none">
                <span className="inline-block animate-slide-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                  Discover
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-slide-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
                  Amazing
                </span>
                <br />
                <span className="inline-block animate-slide-up opacity-0" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
                  Food Trucks
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in opacity-0" style={{animationDelay: '1s', animationFillMode: 'forwards'}}>
              Find extraordinary culinary experiences on wheels. Discover, rate, and enjoy the best local food trucks with real-time tracking and reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in opacity-0" style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}>
              <Link
                to="/food-trucks"
                className="group relative inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Explore Food Trucks
                </span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-2 group-hover:text-white transition-all duration-300" />
              </Link>
              
              <Link
                to="/map"
                className="group relative inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl overflow-hidden hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <MapPin className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                View Live Map
              </Link>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(84)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full" />
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="how-it-works" 
            data-animate
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              How It
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent"> Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing food trucks in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <div 
                key={index} 
                className={`relative group transform transition-all duration-700 ${
                  isVisible['how-it-works'] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent z-0" />
                )}
                
                <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-blue-100 group-hover:border-blue-300">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">{step.step}</span>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl group-hover:scale-110 transition-all duration-300">
                      <step.icon className="w-10 h-10 text-blue-600 group-hover:animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-2xl opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-300" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="mt-6 flex justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transform transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div 
            className={`text-center mt-16 transform transition-all duration-1000 ${
              isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
            style={{ transitionDelay: '0.8s' }}
          >
            <Link
              to="/food-trucks"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              <span>Get Started Now</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-sky-400/10 to-blue-400/10 rounded-full -translate-x-32 -translate-y-32 animate-slow-spin" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full translate-x-32 translate-y-32 animate-slow-spin-reverse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="features" 
            data-animate
            className={`text-center mb-20 transform transition-all duration-1000 ${
              isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose
              <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent block">
                Curbside Cuisine?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of food truck discovery with our cutting-edge platform designed for food lovers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative transform transition-all duration-700 hover:scale-105 ${
                  isVisible.features 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full">
                  
                  <div className="relative mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-2xl animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animation: 'spin 8s linear infinite' }} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transform transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-24 bg-gradient-to-br from-blue-900 via-sky-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 4}s`
              }}
            />
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-transparent to-blue-600/20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div 
            id="cta" 
            data-animate
            className={`transform transition-all duration-1000 ${
              isVisible.cta ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Ready for Your Next
              <span className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent block">
                Culinary Adventure?
              </span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our community of passionate food explorers and discover extraordinary flavors on wheels. Your taste buds will thank you!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <Users className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                <span className="relative z-10">Join Free Today</span>
              </Link>
              
              <Link
                to="/food-trucks"
                className="group inline-flex items-center px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-900 transform hover:scale-105 transition-all duration-300"
              >
                <span>Start Exploring</span>
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(-10px) rotate(240deg); }
    }
    
    @keyframes slow-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes slow-spin-reverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    
    @keyframes slide-up {
      from { 
        opacity: 0; 
        transform: translateY(50px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-slow-spin {
      animation: slow-spin 30s linear infinite;
    }
    
    .animate-slow-spin-reverse {
      animation: slow-spin-reverse 25s linear infinite;
    }
    
    .animate-slide-up {
      animation: slide-up 0.8s ease-out forwards;
    }
    
    .animate-fade-in {
      animation: fade-in 0.8s ease-out forwards;
    }
    
    .animate-pulse-ring {
      animation: pulse-ring 2s ease-out infinite;
    }
    
    .animate-spin-slow {
      animation: slow-spin 8s linear infinite;
    }
    
    .bg-grid-pattern {
      background-image: 
        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    }
    
    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .duration-2000 {
      transition-duration: 2000ms;
    }
    
    /* Hover effects */
    .group:hover .group-hover\\:animate-pulse {
      animation: pulse 1s ease-in-out infinite;
    }
    
    .group:hover .group-hover\\:animate-bounce {
      animation: bounce 1s ease-in-out infinite;
    }
    
    /* Custom gradient animations */
    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 3s ease infinite;
    }
  `;
  
  if (!document.head.querySelector('[data-home-styles]')) {
    style.setAttribute('data-home-styles', 'true');
    document.head.appendChild(style);
  }
}

export default Home;