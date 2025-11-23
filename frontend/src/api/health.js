import axios from 'axios';

const API_BASE_URL = 'https://tinyurl-generator-4wmc.vercel.app';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Check backend health status
 * @returns {Promise} Response with health status and response time
 */
export const checkHealth = async () => {
    const startTime = performance.now();
    try {
        const response = await api.get('/healthz');
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        return {
            ...response.data,
            responseTime,
            timestamp: new Date().toISOString(),
            backendUrl: API_BASE_URL
        };
    } catch (error) {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        throw {
            ok: false,
            error: error.message,
            responseTime,
            timestamp: new Date().toISOString(),
            backendUrl: API_BASE_URL
        };
    }
};

export default api;
