import axios from "axios";
import axiosInstance from "./axiosInstance";

// Function to fetch all users data
export const loginRequest = async (payload) => {
  console.log(payload, "afsdf");

  const response = await axiosInstance.post(`/login`, payload, {
    withCredentials: true,
  });
  return response.data || response; // Assuming the response contains the data
};
