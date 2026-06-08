// ── MAC & GLOW API CLIENT ──────────────────────

(function() {
  var API_BASE = window.API_BASE_URL || '/api';

  function getToken() {
    return localStorage.getItem('mg_token') || sessionStorage.getItem('mg_token');
  }

  function setToken(token, remember) {
    if (remember) {
      localStorage.setItem('mg_token', token);
    } else {
      sessionStorage.setItem('mg_token', token);
    }
  }

  function clearToken() {
    localStorage.removeItem('mg_token');
    sessionStorage.removeItem('mg_token');
    localStorage.removeItem('mg_session');
    sessionStorage.removeItem('mg_session');
  }

  function apiRequest(endpoint, options) {
    options = options || {};
    var url = API_BASE + endpoint;
    var config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    if (options.body) {
      config.body = JSON.stringify(options.body);
    }
    return fetch(url, config).then(function(res) {
      return res.json().then(function(data) {
        if (!res.ok) {
          var err = new Error(data.error || 'Request failed');
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    });
  }

  // Auth API
  window.MG_API = {
    register: function(name, email, phone, password) {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: { name: name, email: email, phone: phone, password: password }
      });
    },

    login: function(email, password) {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: { email: email, password: password }
      });
    },

    getProfile: function() {
      return apiRequest('/auth/profile');
    },

    updateProfile: function(data) {
      return apiRequest('/auth/profile', {
        method: 'PUT',
        body: data
      });
    },

    changePassword: function(currentPassword, newPassword) {
      return apiRequest('/auth/password', {
        method: 'PUT',
        body: { currentPassword: currentPassword, newPassword: newPassword }
      });
    },

    forgotPassword: function(email) {
      return apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email: email }
      });
    },

    // Orders API
    createOrder: function(orderData) {
      return apiRequest('/orders', {
        method: 'POST',
        body: orderData
      });
    },

    getMyOrders: function() {
      return apiRequest('/orders/my');
    },

    trackOrder: function(orderId) {
      return apiRequest('/orders/track/' + orderId);
    },

    cancelOrder: function(orderId) {
      return apiRequest('/orders/' + orderId + '/cancel', {
        method: 'PUT'
      });
    },

    // Contact API
    sendContact: function(data) {
      return apiRequest('/contact', {
        method: 'POST',
        body: data
      });
    },

    subscribeNewsletter: function(email) {
      return apiRequest('/contact/newsletter', {
        method: 'POST',
        body: { email: email }
      });
    },

    // Wishlist API
    getWishlist: function() {
      return apiRequest('/wishlist');
    },

    addToWishlist: function(item) {
      return apiRequest('/wishlist', {
        method: 'POST',
        body: item
      });
    },

    removeFromWishlist: function(productId) {
      return apiRequest('/wishlist/' + productId, {
        method: 'DELETE'
      });
    },

    // Products API
    getProducts: function() {
      return apiRequest('/products');
    },

    getProduct: function(id) {
      return apiRequest('/products/' + id);
    },

    // Helpers
    getToken: getToken,
    setToken: setToken,
    clearToken: clearToken
  };
})();
