// Если в будущем бэкенд будет на другом домене, поменяйте этот адрес здесь:
const BASE_SERVER_URL = 'http://localhost:3001'; 
const LOCAL_DB_URL = '/db.json';

export const client = {
  get: async (endpoint) => {
    const res = await fetch(LOCAL_DB_URL);
    if (!res.ok) throw new Error('Network error while fetching db.json');
    
    const allData = await res.json();
    const key = endpoint ? endpoint.replace(/^\/+|\/+$/g, '') : '';
    
    if (key && allData[key]) {
      return allData[key];
    }
    
    return allData;
  },

  post: async (endpoint, data) => {
    try {
      const res = await fetch(`${BASE_SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // Если сервер вернул ошибку (400, 404, 500 и т.д.)
      if (!res.ok) {
        // Пробуем прочитать текст ошибки от бэкенда, если он есть
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send reservation. Please try again.');
      }
      
      return await res.json();
    } catch (err) {
      // Перенаправляем ошибку дальше в хук usePost
      throw err;
    }
  }
};