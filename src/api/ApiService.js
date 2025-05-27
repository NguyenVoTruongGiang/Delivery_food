import axios from "axios";

// Base URL cho API
const baseUrl = "http://localhost:3000"; // Đặt đúng cổng backend của bạn

// Hàm lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Hàm gọi API chung
const request = async (
  method,
  endpoint,
  data,
  useToken = true
) => {
  try {
    const config = {
      method,
      url: `${baseUrl}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
      ...(data && { data }),
      withCredentials: true,
    };

    if (useToken) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log("url: ", `${baseUrl}${endpoint}`);
    return await axios(config);
  } catch (error) {
    console.error("API Error: ", error);
    throw error;
  }
};

export const get = async (endpoint) => request("GET", endpoint);
export const post = async (endpoint, data) => request("POST", endpoint, data);
export const put = async (endpoint, data) => request("PUT", endpoint, data);
export const del = async (endpoint) => request("DELETE", endpoint);
export const login = async (endpoint, data) => request("POST", endpoint, data, false);