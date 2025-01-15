import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "./constants";

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
});

export const axiosError = (error) => {
  return error instanceof AxiosError;
};
