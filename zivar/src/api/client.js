const API_URL = '/db.json';

export const client = {
  get: async (endpoint) => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network error while fetching db.json');
    
    const allData = await res.json();
    const key = endpoint ? endpoint.replace(/^\/+|\/+$/g, '') : '';
    
    if (key && allData[key]) {
      return allData[key];
    }
    
    return allData;
  },

  post: async (endpoint, data) => {
    // РЕАЛЬНЫЙ запрос к бэкенду (json-server или твой сервер)
    const res = await fetch(`http://localhost:3001${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error('Failed to send reservation');
    return res.json();
  }
};