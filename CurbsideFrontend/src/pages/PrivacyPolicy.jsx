import { Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageStyles = `
  @keyframes fadeInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-privacy-styles]')) {
    styleSheet.setAttribute('data-privacy-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fadeInUp">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Privacy Policy</h1>
            <p className="text-xl text-sky-100">Last updated: October 24, 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-sky-100">
          
          {/* Introduction */}
          <section className="mb-12 animate-fadeInUp">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Curbside Cuisine, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address when you register</li>
                  <li>Phone number (optional)</li>
                  <li>Business information if you're a food truck vendor</li>
                  <li>Profile information you choose to provide</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Location Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your device's location when you use our map features (with your permission)</li>
                  <li>Food truck locations provided by vendors</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Reviews and ratings you post</li>
                  <li>Your favorite food trucks</li>
                  <li>Search queries and browsing behavior</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
              <li>To provide and maintain our service</li>
              <li>To show you relevant food trucks near your location</li>
              <li>To enable you to post reviews and interact with the community</li>
              <li>To allow food truck vendors to manage their listings</li>
              <li>To send you important updates and notifications</li>
              <li>To improve our platform and user experience</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>We do not sell your personal information. We may share your information in the following situations:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With Food Truck Vendors:</strong> Your name and review content are visible to vendors when you review their trucks</li>
                <li><strong>Publicly:</strong> Your reviews, ratings, and public profile information are visible to other users</li>
                <li><strong>Service Providers:</strong> We may share information with trusted service providers who help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your information. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
            
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
              <li><strong>Access:</strong> You can access and update your personal information in your profile settings</li>
              <li><strong>Delete:</strong> You can request deletion of your account and personal data</li>
              <li><strong>Opt-Out:</strong> You can opt out of non-essential communications</li>
              <li><strong>Location:</strong> You can disable location services at any time through your device settings</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and 
              remember your preferences. You can control cookies through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
            
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
            
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="animate-fadeInUp" style={{animationDelay: '0.9s'}}>
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-200">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-sky-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> CurbsideCuisine@gmail.com</p>
                <p><strong>Phone:</strong> (+64) 225064062</p>
              </div>
              <Link
                to="/contact"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
