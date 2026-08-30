import { setUser, setError, setLoading } from "../Redux/auth.slice.js";
import { useDispatch } from 'react-redux';
import authService from "../Service/authService";
import { logout as logoutFromServer } from "../../Setting/Service/settingService";

export const useAuth = () => {
    const dispatch = useDispatch();

    const registerUser = async (userData) => {
        dispatch(setLoading(true));
        dispatch(setError(null)); // Clear previous errors
        try {
            const response = await authService.register(userData);
            if (response?.success) {
                dispatch(setUser(response.user || userData));
                return { success: true };
            } else {
                const errorMessage = response?.message || response?.error || "Registration failed";
                dispatch(setError(errorMessage));
                return { success: false, error: errorMessage };
            }
        } catch (err) {
            const fallbackError = err?.response?.data?.message || err.message || "An unexpected error occurred";
            dispatch(setError(fallbackError));
            return { success: false, error: fallbackError };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const loginUser = async (credentials) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const response = await authService.login(credentials);
            if (response?.success) {
                dispatch(setUser(response.user));
                return { success: true };
            } else {
                const errorMessage = response?.message || response?.error || "Invalid credentials";
                dispatch(setError(errorMessage));
                return { success: false, error: errorMessage };
            }
        } catch (err) {
            const fallbackError = err?.response?.data?.message || err.message || "Login server error";
            dispatch(setError(fallbackError));
            return { success: false, error: fallbackError };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = async () => {
        dispatch(setLoading(true));
        try {
            await logoutFromServer();
        } catch (err) {
            await authService.logout();
            console.error("Logout warning:", err.message);
        } finally {
            dispatch(setUser(null));
            dispatch(setError(null));
            dispatch(setLoading(false));
        }
    };

    const getMeUser = async () => {
        dispatch(setLoading(true));
        try {
            const response = await authService.getMe()
            dispatch(setUser(response?.user))
            return response
        }
        catch (err) {
            dispatch(setError(err?.message || "Something wrong when fetching user details"))
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        registerUser,
        loginUser,
        logoutUser,
        getMeUser
    };
};