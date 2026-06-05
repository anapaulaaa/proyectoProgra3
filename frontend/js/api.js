window.GastroAPI = {
  baseUrl: 'http://localhost:3001/api',

  url(path) {
    return `${this.baseUrl}${path}`;
  },

  get(path, options = {}) {
    return fetch(this.url(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    }).then(response => response.json());
  },

  post(path, body) {
    return fetch(this.url(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  },

  put(path, body) {
    return fetch(this.url(path), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(response => response.json());
  },

  delete(path) {
    return fetch(this.url(path), {
      method: 'DELETE'
    }).then(response => response.json());
  }
};