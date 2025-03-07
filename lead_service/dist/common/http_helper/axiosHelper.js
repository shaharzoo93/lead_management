"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosApiRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const axiosApi = axios_1.default.create({
    headers: {
        'Content-Type': 'application/json',
        // Add any custom headers if required
    },
});
axiosApi.interceptors.request.use((config) => {
    const token = ''; // Replace with actual token logic
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
axiosApi.interceptors.response.use((response) => response, (error) => {
    if (error.response) {
        const { status } = error.response;
        switch (status) {
            case 400:
                break;
            case 401:
                break;
            case 404:
                break;
            case 422:
                break;
            case 500:
                break;
            default:
                console.error('Unknown Error:', error.message);
        }
    }
    else {
        console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
});
const handleApiCall = async (apiCall) => {
    try {
        const response = await apiCall();
        return response.data;
    }
    catch (error) {
        if (error.response &&
            error.response.data &&
            (error.response.data.status == false || error.response.data.status == 500 || error.response.data.status == 422)) {
            throw error.response.data;
        }
        else
            throw error;
    }
};
exports.axiosApiRequest = {
    get: async (url) => {
        return handleApiCall(() => axiosApi.get(url));
    },
    post: async (url, body) => {
        return handleApiCall(() => axiosApi.post(url, body));
    },
    put: async (url, body) => {
        return handleApiCall(() => axiosApi.put(url, body));
    },
    delete: async (url) => {
        return handleApiCall(() => axiosApi.delete(url));
    },
};
