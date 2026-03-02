/**
 * Helper class gọi API
 */
const api = {
    baseUrl: '/api',

    async request(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (data) Object.assign(options, { body: JSON.stringify(data) });

            const res = await fetch(`${this.baseUrl}${endpoint}`, options);
            const json = await res.json();

            if (!res.ok) throw new Error(json.message || `HTTP Error ${res.status}`);
            return json;

        } catch (error) {
            alert(`Lỗi API: ${error.message}`);
            throw error;
        }
    },

    get: (endpoint) => api.request(endpoint),
    post: (endpoint, data) => api.request(endpoint, 'POST', data),
    put: (endpoint, data) => api.request(endpoint, 'PUT', data),
    delete: (endpoint) => api.request(endpoint, 'DELETE')
};
