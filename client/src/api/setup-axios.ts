import axios from 'axios';
import * as store from 'store';

import { config } from '../config';

export const setupAxios = () => {
  axios.defaults.baseURL = config.apiUrl;
};

const getApiAxios = () => {
  const token = store.get(config.localStorageKeys.token);

  const axiosApi = axios.create({ baseURL: config.apiUrl });

  axiosApi.interceptors.request.use((axiosConfig) => {
    axiosConfig.timeout = 200000;
    token && (axiosConfig.headers.Authorization = token);

    return axiosConfig;
  });

  axiosApi.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        store.clearAll();
      }

      return Promise.reject(error);
    },
  );

  return axiosApi;
};

export const apiAxios = getApiAxios();
