import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    register,
    login,
    logout,
    fetchMe,
    clearAuth,
    clearError,
    clearMessage,
} from "../Redux/auth.slice.js";

export const useAuth = ({ autoFetchMe = false } = {}) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (autoFetchMe) {
            dispatch(fetchMe());
        }
    }, [autoFetchMe, dispatch]);

    const handleRegister = useCallback(
        async (userData) => {
            const result = await dispatch(register(userData));
            const isSuccess = register.fulfilled.match(result);
            return {
                success: isSuccess,
                data: isSuccess ? result.payload : null,
                error: !isSuccess ? result.payload : null,
            };
        },
        [dispatch]
    );

    const handleLogin = useCallback(
        async (credentials) => {
            const result = await dispatch(login(credentials));
            const isSuccess = login.fulfilled.match(result);
            return {
                success: isSuccess,
                data: isSuccess ? result.payload : null,
                error: !isSuccess ? result.payload : null,
            };
        },
        [dispatch]
    );

    const handleLogout = useCallback(async () => {
        const result = await dispatch(logout());
        const isSuccess = logout.fulfilled.match(result);
        if (!isSuccess) {
            dispatch(clearAuth());
        }
        return {
            success: true,
            data: isSuccess ? result.payload : null,
            error: null,
        };
    }, [dispatch]);

    const handleGetMe = useCallback(async () => {
        const result = await dispatch(fetchMe());
        const isSuccess = fetchMe.fulfilled.match(result);
        return {
            success: isSuccess,
            data: isSuccess ? result.payload : null,
            error: !isSuccess ? result.payload : null,
        };
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        message,
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        clearAuth: () => dispatch(clearAuth()),
        clearError: () => dispatch(clearError()),
        clearMessage: () => dispatch(clearMessage()),
    };
};
