import axios from "axios";

const Url =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_LOCAL;

export const axiosInstance = axios.create({
  baseURL: Url,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    let token;
    // Check if running on the client side
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
      //console.log(token, "token");
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
