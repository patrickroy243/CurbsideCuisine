import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Root';
import { Navigation, MapPin, ArrowLeft, Save, Plus, Edit, Trash2, DollarSign, Sparkles, Truck } from 'lucide-react';
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
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
  .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageStyles;
  if (!document.head.querySelector('[data-edit-truck-styles]')) {
    styleSheet.setAttribute('data-edit-truck-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

const EditFoodTruck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  
  const [truck, setTruck] = useState({
    name: '',
    description: '',
    cuisine: '',
    phone: '',
    website: '',
    imageUrl: '',
    latitude: '',
    longitude: '',
    locationName: '',
    isActive: true,
    isOpen: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchFoodTruck();
    fetchMenuItems();
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

      if (truckData) {
        setTruck({
          name: truckData.name || '',
          description: truckData.description || '',
          cuisine: truckData.cuisine || '',
          phone: truckData.phone || '',
          website: truckData.website || '',
          imageUrl: truckData.imageUrl || '',
          latitude: truckData.latitude?.toString() || '',
          longitude: truckData.longitude?.toString() || '',
          locationName: truckData.locationName || `${truckData.latitude}, ${truckData.longitude}`,
          isActive: truckData.isActive ?? true,
          isOpen: truckData.isOpen ?? false
        });
      }
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

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setGettingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const locationName = await getReverseGeocode(latitude, longitude);
          
          setTruck(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationName: locationName
          }));
          
          setGettingLocation(false);
        } catch (error) {
          console.error('Error getting location name:', error);
          setTruck(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationName: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location access and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      options
    );
  };

  const getReverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.locality 
          ? `${data.locality}, ${data.principalSubdivision}` 
          : `${data.city || data.principalSubdivision}, ${data.countryName}`;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTruck(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMenuInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      const maxSize = 15 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File size must be less than 15MB');
        return;
      }

      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setTruck(prev => ({ ...prev, imageUrl: '' }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!truck.latitude || !truck.longitude) {
      setError('Please set a location for your food truck');
      setSaving(false);
      return;
    }

    try {
      let imageUrl = truck.imageUrl;

      if (selectedFile) {
        setUploadingImage(true);
        try {
          const uploadResponse = await apiService.uploadFoodTruckImage(selectedFile);
          imageUrl = uploadResponse.data;
        } catch (uploadErr) {
          console.error('Error uploading image:', uploadErr);
          setError('Failed to upload image: ' + uploadErr.message);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const updateData = {
        name: truck.name,
        description: truck.description,
        cuisine: truck.cuisine,
        phone: truck.phone || null, 
        website: truck.website || null,
        imageUrl: imageUrl || null,
        latitude: parseFloat(truck.latitude) || 0,
        longitude: parseFloat(truck.longitude) || 0,
        locationName: truck.locationName || null,
        isActive: truck.isActive,
        isOpen: truck.isOpen
      };

      await apiService.updateFoodTruck(id, updateData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update food truck');
      console.error('Error updating food truck:', err);
    } finally {
      setSaving(false);
    }
  };

  const openMenuModal = (menuItem = null) => {
    if (menuItem) {
      setEditingMenuItem(menuItem);
      setMenuFormData({
        name: menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price?.toString() || '',
        category: menuItem.category || '',
        isAvailable: menuItem.isAvailable ?? true
      });
    } else {
      setEditingMenuItem(null);
      setMenuFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true
      });
    }
    setShowMenuModal(true);
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true
    });
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setMenuSaving(true);

    try {
      const menuData = {
        ...menuFormData,
        price: parseFloat(menuFormData.price) || 0
      };

      if (editingMenuItem) {
        await apiService.updateMenuItem(id, editingMenuItem.menuItemId || editingMenuItem.id, menuData);
      } else {
        await apiService.createMenuItem(id, menuData);
      }

      await fetchMenuItems();
      closeMenuModal();
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
      console.error('Error saving menu item:', err);
    } finally {
      setMenuSaving(false);
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await apiService.deleteMenuItem(id, menuItemId);
      await fetchMenuItems();
    } catch (err) {
      setError(err.message || 'Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading food truck details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <div className="bg-gradient-to-r from-sky-400 to-sky-300 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-white hover:text-sky-100 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Edit Food Truck</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="p-6 border-b border-sky-100">
              <h2 className="text-xl font-semibold text-gray-900">Food Truck Details</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={truck.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type</label>
                <input
                  type="text"
                  name="cuisine"
                  required
                  value={truck.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  value={truck.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={truck.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                <input
                  type="url"
                  name="website"
                  value={truck.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Truck Image (Optional)</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                  />
                  <p className="text-sm text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 15MB.
                  </p>
                </div>

                {(imagePreview || truck.imageUrl) && (
                  <div className="mt-3 relative">
                    <img 
                      src={imagePreview || truck.imageUrl} 
                      alt="Food truck preview" 
                      className="w-full h-40 object-cover rounded-md border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

                {uploadingImage && (
                  <div className="mt-2 flex items-center text-sky-600">
                    <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading image...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="flex items-center justify-center px-4 py-2 bg-sky-100 text-sky-700 border border-sky-300 rounded-md hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 w-full"
                  >
                    {gettingLocation ? (
                      <>
                        <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        Update to Current Location
                      </>
                    )}
                  </button>

                  {locationError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                      {locationError}
                    </div>
                  )}

                  {truck.locationName && (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="font-medium">Current Location:</span>
                      </div>
                      <p className="mt-1">{truck.locationName}</p>
                      {truck.latitude && truck.longitude && (
                        <p className="text-xs text-green-600 mt-1">
                          Coordinates: {parseFloat(truck.latitude).toFixed(6)}, {parseFloat(truck.longitude).toFixed(6)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={truck.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Active</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={truck.isOpen}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Currently Open</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !truck.latitude || !truck.longitude}
                  className="px-6 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="p-6 border-b border-sky-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
                <button
                  onClick={() => openMenuModal()}
                  className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {menuLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No menu items yet</p>
                  <button
                    onClick={() => openMenuModal()}
                    className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                  >
                    Add Your First Menu Item
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {menuItems.map((item) => (
                    <div key={item.menuItemId || item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center text-sky-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {item.price?.toFixed(2)}
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                        <div className="flex items-center mt-2 space-x-4">
                          {item.category && (
                            <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => openMenuModal(item)}
                          className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors"
                          title="Edit item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.menuItemId || item.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMenuModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              
              <form onSubmit={handleMenuSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={menuFormData.name}
                    onChange={handleMenuInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={menuFormData.description}
                    onChange={handleMenuInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      required
                      value={menuFormData.price}
                      onChange={handleMenuInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={menuFormData.category}
                      onChange={handleMenuInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g., Main, Dessert"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={menuFormData.isAvailable}
                    onChange={handleMenuInputChange}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Available</label>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeMenuModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={menuSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                  >
                    {menuSaving ? 'Saving...' : (editingMenuItem ? 'Update Item' : 'Add Item')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFoodTruck;