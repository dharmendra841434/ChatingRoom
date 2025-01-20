import axios from "axios";
import Cookies from "js-cookie"; // Client-side cookie management

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let token;

    // Check if running on the client side
    if (typeof window !== "undefined") {
      token = Cookies.get("accessToken"); // Get the token from cookies on the client side
      console.log(token, "this is token from instance");
    } else {
      // If running on the server, the token needs to be retrieved differently
      console.warn(
        "Token retrieval in SSR context needs to be handled separately."
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch logout action (or handle as needed)
      // Example: store.dispatch(logout());
      console.log("Unauthorized. Token might be invalid or expired.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
