import axiosInstance from "./axiosInstance";

// Function to fetch all users data
export const loginRequest = async (payload) => {
  const response = await axiosInstance.post(`/auth/login`, payload, {
    withCredentials: true,
  });
  return response.data || response; // Assuming the response contains the data
};

// Function to fetch all users data
export const getAllGroups = async (payload) => {
  const response = await axiosInstance.get(`/group/all/${payload.userId}`);

  console.log("list response", response);

  return response.data || response; // Assuming the response contains the data
};

// Function to create a new group
export const createGroupRequest = async (payload) => {
  const response = await axiosInstance.post(`/group/create`, payload);
  return response.data || response; // Assuming the response contains the data
};
// Function to join a group
export const joinGroupRequest = async (payload) => {
  const response = await axiosInstance.post(`/group/join`, payload);
  return response.data || response; // Assuming the response contains the data
};

// Function to fetch register users
export const registerRequest = async (payload) => {
  const response = await axiosInstance.post(`/auth/register`, payload);
  return response.data || response; // Assuming the response contains the data
};

// Function to fetch all users data
export const checkUsernameRequest = async (payload) => {
  const response = await axiosInstance.post(`/auth/check-usernames`, payload);
  return response.data || response; // Assuming the response contains the data
};
