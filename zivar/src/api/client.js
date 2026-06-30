const API_URL = '/db.json';

export const client = {
  /**
   * Получение данных из статичного db.json
   * @param {string} endpoint - имя ключа в JSON (например, '/users' или 'products')
   */
  get: async (endpoint) => {
    // Делаем запрос строго к самому файлу db.json в папке public
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network error while fetching db.json');
    
    const allData = await res.json();
    
    // Очищаем эндпоинт от ведущих и замыкающих слэшей (например, '/users/' -> 'users')
    const key = endpoint ? endpoint.replace(/^\/+|\/+$/g, '') : '';
    
    // Если ключ передан и он есть в db.json, возвращаем только эту часть
    if (key && allData[key]) {
      return allData[key];
    }
    
    // Если ключ не передан или не найден, возвращаем весь объект целиком
    return allData;
  },

  /**
   * Имитация отправки данных (так как реальный JSON на сервере перезаписать нельзя)
   */
  post: async (endpoint, data) => {
    console.group(`%c[Mock API POST] к эндпоинту: ${endpoint}`, 'color: #00bcd4; font-weight: bold;');
    console.log('Отправленные данные:', data);
    console.groupEnd();

    // Имитируем небольшую задержку сети в 500мс для реалистичности (появится лоадер)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Возвращаем фейковый успешный ответ, чтобы хук usePost перешел в состояние success: true
    return { 
      success: true, 
      message: "Data mock-saved successfully (Static JSON mode)", 
      id: Math.floor(Math.random() * 10000), // генерируем случайный id
      ...data 
    };
  }
};