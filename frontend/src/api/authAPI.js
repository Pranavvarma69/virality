// src/api/authAPI.js
import axios from "axios";

const API = axios.create({ baseURL: "/api/users" });

export const RegisterUser = async (userData) => {
  const { data } = await API.post("/register", userData);
  if (data.token) {
    localStorage.setItem("userInfo", JSON.stringify(data));
    window.dispatchEvent(new Event("userChanged"));
  }
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/login", credentials);
  if (data.token) {
    localStorage.setItem("userInfo", JSON.stringify(data));
    window.dispatchEvent(new Event("userChanged"));
  }
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("userInfo");
  window.dispatchEvent(new Event("userChanged"));
};