import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react';

const pageStyles = `
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0,-30px,0); }
    70% { transform: translate3d(0,-15px,0); }
    90% { transform: translate3d(0,-4px,0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-bounce { animation: bounce 2s infinite; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-notfound-styles]')) {
    styleSheet.setAttribute('data-notfound-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-cyan-200/25 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 animate-fadeInUp">
          <div className="relative inline-block">
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-bounce">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Search className="w-16 h-16 text-sky-300/50 animate-float" style={{animationDelay: '1s'}} />
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The food truck you're looking for seems to have driven away! 
            <br />
            Don't worry, there are plenty of delicious options waiting for you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/food-trucks"
            className="inline-flex items-center px-8 py-4 bg-white text-sky-600 font-semibold border border-sky-200 rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Search className="w-5 h-5 mr-2" />
            Find Food Trucks
          </Link>
        </div>

        <div className="mt-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-sky-400 animate-float" />
            </div>
            <p className="text-gray-700 font-medium">
              "Every wrong turn leads to a new adventure! 
              <br />
              Let's find you some amazing food instead."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;