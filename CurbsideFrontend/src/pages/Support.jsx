import { HelpCircle, Mail, Phone, MapPin, MessageCircle, Book, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  if (!document.head.querySelector('[data-support-styles]')) {
    styleSheet.setAttribute('data-support-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const Support = () => {
  const faqs = [
    {
      question: "How do I find food trucks near me?",
      answer: "Use our Map feature to see all food trucks in your area. Click the 'My Location' button to center the map on your current location, or search for a specific area."
    },
    {
      question: "How do I register my food truck?",
      answer: "Click 'Sign up' and select the vendor account type. Once registered, you can add your food truck from your dashboard with details like location, menu, and operating hours."
    },
    {
      question: "How do I update my truck's location?",
      answer: "Log in to your dashboard, select your food truck, and use the 'Update Location' feature. You can either enter coordinates manually or use your current location."
    },
    {
      question: "Can I leave reviews?",
      answer: "Yes! Once you're logged in, visit any food truck's detail page and you can leave a rating and review. Please keep reviews honest and respectful."
    },
    {
      question: "How do I edit or delete my review?",
      answer: "Currently, reviews can be edited by contacting our support team. We're working on adding self-service review editing in a future update."
    },
    {
      question: "What if I forgot my password?",
      answer: "On the login page, click 'Forgot Password' and follow the instructions. You'll receive an email with a link to reset your password."
    },
    {
      question: "How do I delete my account?",
      answer: "Go to your Profile settings and look for the 'Delete Account' option. You can also contact support for assistance with account deletion."
    },
    {
      question: "Are the food truck locations real-time?",
      answer: "Locations are updated by food truck vendors. We encourage vendors to update their location regularly. The accuracy depends on how recently the vendor updated their information."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-sky-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fadeInUp">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <HelpCircle className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Support Center</h1>
            <p className="text-xl md:text-2xl text-sky-100 max-w-3xl mx-auto">
              We're here to help! Find answers or get in touch with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Email Support</h3>
            <p className="text-gray-700 text-center mb-6">
              Get help via email. We typically respond within 24 hours.
            </p>
            <div className="text-center">
              <a 
                href="mailto:CurbsideCuisine@gmail.com"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                CurbsideCuisine@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp hover:shadow-xl transition-shadow" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Phone Support</h3>
            <p className="text-gray-700 text-center mb-6">
              Call us during business hours for immediate assistance.
            </p>
            <div className="text-center">
              <a 
                href="tel:+64225064062"
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                (+64) 225064062
              </a>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp hover:shadow-xl transition-shadow" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">Contact Form</h3>
            <p className="text-gray-700 text-center mb-6">
              Fill out our contact form and we'll get back to you soon.
            </p>
            <div className="text-center">
              <Link 
                to="/contact"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              >
                Go to Contact Form
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200"
              >
                <div className="flex items-start">
                  <ChevronRight className="w-6 h-6 text-sky-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Customers</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/food-trucks" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Browse Food Trucks
                </Link>
              </li>
              <li>
                <Link to="/map" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  View Map
                </Link>
              </li>
              <li>
                <Link to="/register" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Manage Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-sky-100 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Vendors</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Register Your Truck
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Learn More About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center text-gray-700 hover:text-sky-600 transition-colors">
                  <ChevronRight className="w-5 h-5 mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Office Location */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-sky-100 text-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
          <p className="text-lg text-gray-700 mb-2">Invercargill, New Zealand</p>
          <p className="text-gray-600">Business Hours: Monday - Friday, 9:00 AM - 5:00 PM NZST</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
