import axios from 'axios';
import * as store from 'store';

import { config } from '../config';
import { routePaths } from '../containers/route-paths';

export const setupAxios = () => {
  axios.defaults.baseURL = config.apiUrl;
};

const getApiAxios = () => {
  const axiosApi = axios.create({ baseURL: config.apiUrl });

  axiosApi.interceptors.request.use((axiosConfig) => {
    axiosConfig.timeout = 200000;
    const token = store.get(config.localStorageKeys.token);
    token && (axiosConfig.headers.Authorization = token);

    return axiosConfig;
  });

  axiosApi.interceptors.response.use(
    (response) => {
      const {
        headers: { authorization },
      } = response;

      if (authorization) {
        store.set('token', authorization);
      }

      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        store.clearAll();
        window.location.href = routePaths.root;
      }

      return Promise.reject(error);
    },
  );

  return axiosApi;
};

export const apiAxios = getApiAxios();
