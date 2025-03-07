import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';

const axiosApi: AxiosInstance = axios.create({
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

axiosApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
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
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  },
);

const handleNetCoreApiCall = async <T>(apiCall: () => Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    if (error.response.status == 400) {
      error.validationError = error.response.data.errors;
      error.status = 422;
      throw error;
    } else if (error.response.status == 500) {
      error.message = error.response.data.error;
      error.status = 422;
      throw error;
    } else throw error;
  }
};

export const netCoreAxiosApiRequest = {
  get: async <T>(url: string): Promise<T> => {
    return handleNetCoreApiCall(() => axiosApi.get<T>(url));
  },

  post: async <S, T>(url: string, body?: S): Promise<T> => {
    return handleNetCoreApiCall(() => axiosApi.post<T>(url, body));
  },

  put: async <S, T>(url: string, body?: S): Promise<T> => {
    return handleNetCoreApiCall(() => axiosApi.put<T>(url, body));
  },

  delete: async <T>(url: string): Promise<T> => {
    return handleNetCoreApiCall(() => axiosApi.delete<T>(url));
  },
};
