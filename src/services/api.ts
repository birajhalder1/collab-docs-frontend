// import axios from "axios";
// import { useAuthStore } from "@/store/auth.store";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().accessToken;
// console.log("token", token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;

import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        useAuthStore.getState().setAuth(data.data.user, data.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();

        window.location.href = "/login";

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
