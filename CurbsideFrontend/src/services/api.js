const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5194/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const logRequest = (method, url, data = null) => {
  console.log(`Making API request: ${url}`);
  if (data) {
    console.log('Request data:', data);
  }
};

const handleUnauthorized = (response) => {
  if (response.status === 401) {
    console.log('Token expired or unauthorized - logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return true;
  }
  return false;
};

const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, options);
  handleUnauthorized(response);
  return response;
};

const apiService = {
  getImageUrl: (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already a full URL (Supabase or Azure), return as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // For legacy Azure filesystem paths, construct full URL
    const apiBaseWithoutPath = API_BASE_URL.replace('/api', '');
    return `${apiBaseWithoutPath}${imageUrl}`;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    logRequest('POST', `${API_BASE_URL}/Auth/login`, credentials);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    logRequest('POST', `${API_BASE_URL}/Auth/register`, userData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getUserProfile: async () => {
    const url = `${API_BASE_URL}/Auth/profile`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateUserProfile: async (profileData) => {
    const url = `${API_BASE_URL}/Auth/profile`;
    logRequest('PUT', url, profileData);

    const response = await fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  changePassword: async (currentPassword, newPassword) => {
    const url = `${API_BASE_URL}/Auth/change-password`;
    logRequest('POST', url, { currentPassword: '[HIDDEN]', newPassword: '[HIDDEN]' });

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getFoodTrucks: async (pageNumber = 1, pageSize = 10) => {
    const url = `${API_BASE_URL}/FoodTruck?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    logRequest('GET', url);

    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getFoodTruckById: async (id) => {
    const url = `${API_BASE_URL}/FoodTruck/${id}`;
    logRequest('GET', url);

    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  createFoodTruck: async (foodTruckData) => {
    const url = `${API_BASE_URL}/FoodTruck`;
    logRequest('POST', url, foodTruckData);

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(foodTruckData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateFoodTruck: async (id, foodTruckData) => {
    const url = `${API_BASE_URL}/FoodTruck/${id}`;
    logRequest('PUT', url, foodTruckData);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(foodTruckData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  uploadFoodTruckImage: async (file) => {
    const url = `${API_BASE_URL}/FoodTruck/upload-image`;
    
    const formData = new FormData();
    formData.append('image', file);

    logRequest('POST', url, { fileName: file.name, fileSize: file.size });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteFoodTruck: async (id) => {
    const url = `${API_BASE_URL}/FoodTruck/${id}`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  testAuth: async () => {
    const url = `${API_BASE_URL}/FoodTruck/test-auth`;
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };
    
    console.log('Testing auth with headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Auth test failed:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Auth test result:', result);
    return result;
  },

  updateFoodTruckStatus: async (foodTruckId, isOpen) => {
    const url = `${API_BASE_URL}/FoodTruck/${foodTruckId}/status`;
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };
    
    console.log('Auth headers:', headers);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    
    try {
      await apiService.testAuth();
    } catch (error) {
      console.error('Auth test failed before status update:', error);
    }
    
    logRequest('PATCH', url, { isOpen });

    const response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ isOpen })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getMenuItems: async (foodTruckId) => {
    const url = `${API_BASE_URL}/MenuItem/foodtruck/${foodTruckId}`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  createMenuItem: async (foodTruckId, menuItemData) => {
    const url = `${API_BASE_URL}/MenuItem/foodtruck/${foodTruckId}`;
    logRequest('POST', url, menuItemData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(menuItemData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateMenuItem: async (foodTruckId, menuItemId, menuItemData) => {
    const url = `${API_BASE_URL}/MenuItem/foodtruck/${foodTruckId}/${menuItemId}`;
    logRequest('PUT', url, menuItemData);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(menuItemData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteMenuItem: async (foodTruckId, menuItemId) => {
    const url = `${API_BASE_URL}/MenuItem/foodtruck/${foodTruckId}/${menuItemId}`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getReviews: async (foodTruckId) => {
    const url = `${API_BASE_URL}/Review/foodtruck/${foodTruckId}`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  createReview: async (foodTruckId, reviewData) => {
    const url = `${API_BASE_URL}/Review/foodtruck/${foodTruckId}`;
    logRequest('POST', url, reviewData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateReview: async (reviewId, reviewData) => {
    const url = `${API_BASE_URL}/Review/${reviewId}`;
    logRequest('PUT', url, reviewData);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteReview: async (foodTruckId, reviewId) => {
    const url = `${API_BASE_URL}/Review/foodtruck/${foodTruckId}/${reviewId}`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  addToFavorites: async (foodTruckId) => {
    const url = `${API_BASE_URL}/FoodTruck/${foodTruckId}/favorite`;
    logRequest('POST', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  removeFromFavorites: async (foodTruckId) => {
    const url = `${API_BASE_URL}/FoodTruck/${foodTruckId}/favorite`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getUserFavorites: async () => {
    const url = `${API_BASE_URL}/FoodTruck/favorites`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  isFavorite: async (foodTruckId) => {
    const url = `${API_BASE_URL}/FoodTruck/${foodTruckId}/is-favorite`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getDashboardStats: async () => {
    const url = `${API_BASE_URL}/Auth/dashboard-stats`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getUserStats: async () => {
    const url = `${API_BASE_URL}/Auth/dashboard-stats`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Admin endpoints
  getUsers: async (pageNumber = 1, pageSize = 100) => {
    const url = `${API_BASE_URL}/Admin/users?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getAllReviews: async (pageNumber = 1, pageSize = 100) => {
    const url = `${API_BASE_URL}/Admin/reviews?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getAdminStatistics: async () => {
    const url = `${API_BASE_URL}/Admin/statistics`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteUser: async (userId) => {
    const url = `${API_BASE_URL}/Admin/users/${userId}`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  deleteFoodTruck: async (truckId) => {
    const url = `${API_BASE_URL}/Admin/foodtrucks/${truckId}`;
    logRequest('DELETE', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  adminUpdateFoodTruckStatus: async (truckId, isActive) => {
    const url = `${API_BASE_URL}/Admin/foodtrucks/${truckId}/${isActive ? 'verify' : 'suspend'}`;
    logRequest('POST', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getAdminFoodTrucks: async (pageNumber = 1, pageSize = 100) => {
    const url = `${API_BASE_URL}/Admin/foodtrucks?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    logRequest('GET', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  updateUserStatus: async (userId, isActive) => {
    const url = `${API_BASE_URL}/Admin/users/${userId}/status`;
    logRequest('POST', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ isActive })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

export default apiService;