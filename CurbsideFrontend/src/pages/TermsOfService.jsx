import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Mail } from 'lucide-react';
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
  if (!document.head.querySelector('[data-terms-styles]')) {
    styleSheet.setAttribute('data-terms-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const TermsOfService = () => {
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
                <Scale className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Terms of Service</h1>
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
              Welcome to Curbside Cuisine. By accessing or using our platform, you agree to be bound by these 
              Terms of Service. Please read them carefully.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              By creating an account, accessing, or using Curbside Cuisine, you agree to comply with and be bound 
              by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not 
              use our service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">User Accounts</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>Account Creation:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must be at least 13 years old to create an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>

              <p className="mt-4"><strong>Account Responsibilities:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are responsible for all activities under your account</li>
                <li>You must not share your account credentials</li>
                <li>You must keep your information up to date</li>
              </ul>
            </div>
          </section>

          {/* User Content */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">User Content and Reviews</h2>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>Your Content:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You retain ownership of content you post (reviews, photos, etc.)</li>
                <li>By posting, you grant us a license to use, display, and distribute your content</li>
                <li>You represent that you have the right to post the content</li>
              </ul>

              <p className="mt-4"><strong>Content Guidelines:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reviews must be honest and based on your actual experience</li>
                <li>No hate speech, harassment, or discriminatory content</li>
                <li>No spam, advertising, or commercial solicitations</li>
                <li>No false, misleading, or defamatory statements</li>
                <li>No copyright infringement or unauthorized use of others' content</li>
              </ul>
            </div>
          </section>

          {/* Food Truck Vendors */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Food Truck Vendor Terms</h2>
            
            <div className="space-y-4 text-gray-700">
              <p><strong>Listing Requirements:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must have the legal right to operate your food truck business</li>
                <li>All information must be accurate and up to date</li>
                <li>You must maintain proper licensing and health permits</li>
                <li>You must promptly update location and hours information</li>
              </ul>

              <p className="mt-4"><strong>Vendor Responsibilities:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with all local health and safety regulations</li>
                <li>Provide accurate menu and pricing information</li>
                <li>Respond professionally to customer reviews</li>
                <li>Honor advertised hours and locations when possible</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Prohibited Activities</h2>
            </div>
            
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to hack, disrupt, or interfere with the platform</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Scrape or harvest data from the platform</li>
              <li>Post fake reviews or manipulate ratings</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
            
            <p className="text-gray-700 leading-relaxed">
              The Curbside Cuisine platform, including its design, features, and content (excluding user-generated 
              content), is owned by us and protected by copyright, trademark, and other intellectual property laws. 
              You may not copy, modify, distribute, or create derivative works without our permission.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Disclaimers</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>"As Is" Service:</strong> The platform is provided "as is" without warranties of any kind. 
                We do not guarantee uninterrupted or error-free service.
              </p>
              <p>
                <strong>Third-Party Content:</strong> We are not responsible for the accuracy of user-generated 
                content, including reviews, ratings, and food truck information provided by vendors.
              </p>
              <p>
                <strong>Food Safety:</strong> We do not inspect or verify food truck operations. Users should 
                verify proper licensing and health permits independently.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
            
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Curbside Cuisine shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including loss of profits, data, or other 
              intangible losses resulting from your use of the platform.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Termination</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account at any time for violations of these terms 
              or for any other reason. You may also delete your account at any time through your profile settings.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '1s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
            
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms of Service at any time. We will notify you of significant changes by 
              posting a notice on the platform or sending you an email. Your continued use of the platform after 
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12 animate-fadeInUp" style={{animationDelay: '1.1s'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Governing Law</h2>
            
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service are governed by the laws of New Zealand. Any disputes shall be resolved in 
              the courts of New Zealand.
            </p>
          </section>

          {/* Contact */}
          <section className="animate-fadeInUp" style={{animationDelay: '1.2s'}}>
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border border-sky-200">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-sky-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;
