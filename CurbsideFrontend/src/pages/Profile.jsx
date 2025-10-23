import { useState, useEffect } from 'react';
import { useAuth } from '../Root';
import { User, Mail, Phone, MapPin, Calendar, Settings, Camera, Save, Edit3, X, Eye, EyeOff, Lock, Bell, Shield, HelpCircle, CheckCircle, AlertCircle, XCircle, Award, Heart, Star, Sparkles, Zap, Activity } from 'lucide-react';
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
  if (!document.head.querySelector('[data-profile-styles]')) {
    styleSheet.setAttribute('data-profile-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const Profile = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    favoriteCount: 0,
    writtenReviewsCount: 0,
    visitsCount: 0
  });
  const [profileData, setProfileData] = useState({
    userName: user?.userName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); 
  };

  const hideNotification = () => {
    setNotification(null);
  };

  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  
  const [notifications, setNotifications] = useState({
    emailPromotions: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyDigest: true
  });

  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true
  });

  
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await apiService.getUserProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setProfileData({
            userName: userData.userName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            bio: userData.bio || ''
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        
        setProfileData({
          userName: user?.userName || user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          location: user?.location || '',
          bio: user?.bio || ''
        });
      }
    };

    const loadUserStats = async () => {
      try {
        setStatsLoading(true);
        const response = await apiService.getUserStats();
        console.log('User stats response:', response);
        if (response.success && response.data) {
          setUserStats({
            favoriteCount: response.data.favoriteCount || 0,
            writtenReviewsCount: response.data.writtenReviewsCount || 0,
            visitsCount: response.data.visitsCount || 0
          });
        } else {
          console.warn('Stats response not successful:', response);
          setUserStats({
            favoriteCount: 0,
            writtenReviewsCount: 0,
            visitsCount: 0
          });
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          showNotification('Please log in again to view your statistics', 'info');
        }
        setUserStats({
          favoriteCount: 0,
          writtenReviewsCount: 0,
          visitsCount: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) {
      loadUserProfile();
      loadUserStats();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const refreshUserStats = async () => {
    try {
      setStatsLoading(true);
      console.log('Refreshing user stats...'); 
      const response = await apiService.getUserStats();
      console.log('Refresh stats response:', response); 
      if (response.success && response.data) {
        setUserStats({
          favoriteCount: response.data.favoriteCount || 0,
          writtenReviewsCount: response.data.writtenReviewsCount || 0,
          visitsCount: response.data.visitsCount || 0
        });
        showNotification('Statistics refreshed successfully!', 'success');
      } else {
        showNotification('Failed to refresh statistics', 'error');
      }
    } catch (error) {
      console.error('Error refreshing user stats:', error);
      showNotification('Error refreshing statistics: ' + error.message, 'error');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiService.updateUserProfile(profileData);
      
      if (response.success && response.data) {
        
        const updatedUser = { 
          ...user, 
          userName: response.data.userName,
          name: response.data.userName, 
          email: response.data.email,
          phone: response.data.phone,
          location: response.data.location,
          bio: response.data.bio
        };
        login(updatedUser, localStorage.getItem('token'));
        showNotification('Profile updated successfully!', 'success');
        setEditing(false);
        await refreshUserStats();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      userName: user?.userName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || ''
    });
    setEditing(false);
  };

  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      showNotification('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification('Failed to update password: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  
  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Notification preferences saved!', 'success');
      setShowNotificationModal(false);
    } catch (error) {
      showNotification('Failed to save preferences. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  
  const handlePrivacyChange = (key, value) => {
    setPrivacy({
      ...privacy,
      [key]: value
    });
  };

  const handlePrivacySave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('Privacy settings updated!', 'success');
      setShowPrivacyModal(false);
    } catch (error) {
      showNotification('Failed to update settings. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  
  const handleSupportChange = (e) => {
    setSupportForm({
      ...supportForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportForm.subject || !supportForm.message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showNotification('Support ticket submitted successfully! We will get back to you soon.', 'success');
      setSupportForm({ subject: '', message: '', priority: 'medium' });
      setShowSupportModal(false);
    } catch (error) {
      showNotification('Failed to submit support ticket. Please try again.', 'error');
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

      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-md w-full">
          <div className={`p-6 rounded-2xl shadow-2xl border backdrop-blur-sm flex items-start space-x-4 transform transition-all duration-500 ease-out ${
            notification.type === 'success' 
              ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800' 
              : notification.type === 'error'
              ? 'bg-red-50/95 border-red-200 text-red-800'
              : 'bg-blue-50/95 border-blue-200 text-blue-800'
          }`} style={{animation: 'slideInFromRight 0.4s ease-out forwards'}}>
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              {notification.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={hideNotification}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="relative inline-block mb-8 animate-fadeInUp">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center text-6xl font-bold text-sky-600 shadow-2xl backdrop-blur-sm pulse-glow">
                  {user?.name?.charAt(0).toUpperCase() || user?.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-2 right-2 p-4 bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-full hover:from-sky-600 hover:to-blue-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">
                  {user?.userName || user?.name}
                </span>
              </h1>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  {user?.role === 'vendor' ? (
                    <>
                      <Award className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Food Truck Owner</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Food Enthusiast</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
                {user?.role === 'vendor' 
                  ? 'Managing delicious food truck experiences and serving amazing street food.' 
                  : 'Exploring the world of street food, one food truck at a time.'}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Heart className={`w-6 h-6 text-white ${statsLoading ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white mb-2">{userStats.favoriteCount}</p>
                    <p className="text-sky-100 text-sm">Favorite Trucks</p>
                  </>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star className={`w-6 h-6 text-white ${statsLoading ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white mb-2">{userStats.writtenReviewsCount}</p>
                    <p className="text-sky-100 text-sm">Reviews Written</p>
                  </>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Activity className={`w-6 h-6 text-white ${statsLoading ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                {statsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white mb-2">{userStats.visitsCount}</p>
                    <p className="text-sky-100 text-sm">Visits This Month</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl animate-slideInLeft">
              <div className="p-8 border-b border-sky-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-600">Manage your account details and preferences</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      editing 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600'
                    }`}
                  >
                    {editing ? (
                      <>
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-5 h-5 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="userName"
                        value={profileData.userName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-sky-400 mr-3" />
                        <span className="text-gray-900">{user?.userName || user?.name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-sky-400 mr-3" />
                        <span className="text-gray-900">{user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-sky-400 mr-3" />
                        <span className="text-gray-900">{profileData.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-sky-400 mr-3" />
                        <span className="text-gray-900">{profileData.location || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-colors"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-900">{profileData.bio || 'No bio provided'}</p>
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="flex gap-4 pt-4 border-t border-sky-100">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 focus:ring-2 focus:ring-sky-300 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Lock className="w-5 h-5 text-sky-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Change Password</h3>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-300 rounded-lg hover:bg-sky-50 hover:border-sky-400 transition-colors"
                  >
                    Update
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-sky-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Manage your email preferences</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNotificationModal(true)}
                    className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-300 rounded-lg hover:bg-sky-50 hover:border-sky-400 transition-colors"
                  >
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-sky-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Privacy Settings</h3>
                      <p className="text-sm text-gray-600">Control your privacy options</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-300 rounded-lg hover:bg-sky-50 hover:border-sky-400 transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-lg font-semibold text-gray-900">Account Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-semibold text-sky-600 capitalize">{user?.role || 'Customer'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
              <div className="p-6 border-b border-sky-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <button
                    onClick={refreshUserStats}
                    disabled={statsLoading}
                    className="p-2 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh statistics"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {statsLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                    </div>
                  </div>
                ) : userStats.favoriteCount === 0 && userStats.writtenReviewsCount === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No recent activity</p>
                    <p className="text-sm text-gray-400">Start exploring food trucks to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userStats.favoriteCount > 0 && (
                      <div className="flex items-center text-sm">
                        <Heart className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-gray-700">Added {userStats.favoriteCount} food truck{userStats.favoriteCount !== 1 ? 's' : ''} to favorites</span>
                      </div>
                    )}
                    {userStats.writtenReviewsCount > 0 && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-gray-700">Wrote {userStats.writtenReviewsCount} review{userStats.writtenReviewsCount !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {userStats.visitsCount > 0 && (
                      <div className="flex items-center text-sm">
                        <Activity className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-gray-700">{userStats.visitsCount} food truck visit{userStats.visitsCount !== 1 ? 's' : ''} recorded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-sky-900 mb-2">Need Help?</h2>
                <p className="text-sky-700 text-sm mb-4">
                  Have questions about your account or need support? We're here to help!
                </p>
                <button 
                  onClick={() => setShowSupportModal(true)}
                  className="w-full px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors font-medium flex items-center justify-center"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-sky-400" />
                  Change Password
                </h2>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-sky-400 text-white py-2 px-4 rounded-lg hover:bg-sky-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-sky-400" />
                  Notification Preferences
                </h2>
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Promotions</h3>
                  <p className="text-sm text-gray-600">Receive promotional emails and special offers</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('emailPromotions')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.emailPromotions ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.emailPromotions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Alerts</h3>
                  <p className="text-sm text-gray-600">Get text messages for important updates</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('smsAlerts')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.smsAlerts ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Browser notifications for real-time updates</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('pushNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.pushNotifications ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                  <p className="text-sm text-gray-600">Weekly summary of your activity</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('weeklyDigest')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.weeklyDigest ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleNotificationSave}
                  disabled={loading}
                  className="flex-1 bg-sky-400 text-white py-2 px-4 rounded-lg hover:bg-sky-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-sky-400" />
                  Privacy Settings
                </h2>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Show Email Address</h3>
                  <p className="text-sm text-gray-600">Make your email visible on your profile</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showEmail ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Show Phone Number</h3>
                  <p className="text-sm text-gray-600">Make your phone number visible on your profile</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showPhone ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Allow Data Collection</h3>
                  <p className="text-sm text-gray-600">Help us improve by sharing usage data</p>
                </div>
                <button
                  onClick={() => handlePrivacyChange('allowDataCollection', !privacy.allowDataCollection)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.allowDataCollection ? 'bg-sky-400' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.allowDataCollection ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handlePrivacySave}
                  disabled={loading}
                  className="flex-1 bg-sky-400 text-white py-2 px-4 rounded-lg hover:bg-sky-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-sky-400" />
                  Contact Support
                </h2>
                <button 
                  onClick={() => setShowSupportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <form onSubmit={handleSupportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleSupportChange}
                  required
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={supportForm.priority}
                  onChange={handleSupportChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={supportForm.message}
                  onChange={handleSupportChange}
                  required
                  rows={4}
                  placeholder="Please describe your issue in detail..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-400"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-sky-400 text-white py-2 px-4 rounded-lg hover:bg-sky-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
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

export default Profile;