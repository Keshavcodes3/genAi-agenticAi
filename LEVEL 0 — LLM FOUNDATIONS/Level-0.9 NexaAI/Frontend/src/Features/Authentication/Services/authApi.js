import apiClient from "./apiClient.js";
import { AUTH_ROUTES } from "../Utils/constants.js";

export const registerUser = async (userData) => {
    const { data } = await apiClient.post(AUTH_ROUTES.register, userData);
    return data;
};

export const loginUser = async (credentials) => {
    const { data } = await apiClient.post(AUTH_ROUTES.login, credentials);
    return data;
};

export const logoutUser = async () => {
    const { data } = await apiClient.post(AUTH_ROUTES.logout);
    return data;
};

export const getMe = async () => {
    const { data } = await apiClient.get(AUTH_ROUTES.me);
    return data;
};
