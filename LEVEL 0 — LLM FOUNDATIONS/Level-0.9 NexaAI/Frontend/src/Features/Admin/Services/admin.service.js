import axios from "axios";
import { BASEURL } from "../../API/ApiStore";

const adminApi = axios.create({
    baseURL: `${BASEURL}/api/admin`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again.";

        return Promise.reject(new Error(message));
    }
);

export const getPlatformAnalytics = async () => {
    const response = await adminApi.get("/analytics");
    return response.data;
};
