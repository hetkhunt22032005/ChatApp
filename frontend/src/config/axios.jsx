import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: baseURL,
});

export const axiosError = (error) => {
  return error instanceof AxiosError
}
