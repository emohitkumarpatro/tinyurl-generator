import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Create a new shortened URL
 * @param {string} originalUrl - The original URL to shorten
 * @param {string} customCode - Optional custom code
 * @returns {Promise} Response with created link
 */
export const createLink = async (originalUrl, customCode = '') => {
    const payload = { originalUrl };
    if (customCode) {
        payload.customCode = customCode;
    }
    return api.post('/api/links', payload);
};

/**
 * Get all links
 * @returns {Promise} Response with array of links
 */
export const getAllLinks = async () => {
    return api.get('/api/links');
};

/**
 * Get stats for a specific link
 * @param {string} code - The short code
 * @returns {Promise} Response with link stats
 */
export const getLinkStats = async (code) => {
    return api.get(`/api/links/${code}`);
};

/**
 * Delete a link
 * @param {string} code - The short code to delete
 * @returns {Promise} Response confirming deletion
 */
export const deleteLink = async (code) => {
    return api.delete(`/api/links/${code}`);
};

/**
 * Get the redirect URL for a code
 * @param {string} code - The short code
 * @returns {string} Full redirect URL
 */
export const getRedirectUrl = (code) => {
    return `${API_BASE_URL}/${code}`;
};

export default api;
