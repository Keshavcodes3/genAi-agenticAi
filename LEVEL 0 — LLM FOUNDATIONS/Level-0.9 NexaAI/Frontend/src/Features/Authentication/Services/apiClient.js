import axios from "axios";
import { API_BASE_URL } from "../Utils/constants.js";

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/auth`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again.";

        return Promise.reject(new Error(message));
    }
);

export default apiClient;
