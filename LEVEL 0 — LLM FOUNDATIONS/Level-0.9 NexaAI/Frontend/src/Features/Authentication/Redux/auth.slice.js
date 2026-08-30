import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
} from "../Services/authApi.js";

const sanitizeUser = (user) => {
    if (!user) return null;
    const safeUser = { ...user };
    delete safeUser.password;
    return safeUser;
};

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            return await registerUser(userData);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            return await loginUser(credentials);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            return await logoutUser();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMe = createAsyncThunk(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            return await getMe();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.message = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        const setPending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const setRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            // Register
            .addCase(register.pending, setPending)
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "Account created successfully.";
                state.user = sanitizeUser(action.payload?.user);
                state.isAuthenticated = false;
            })
            .addCase(register.rejected, setRejected)

            // Login
            .addCase(login.pending, setPending)
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = sanitizeUser(action.payload?.user);
                state.isAuthenticated = true;
                state.message = action.payload?.message || "Login successful.";
                state.error = null;
            })
            .addCase(login.rejected, setRejected)

            // Logout
            .addCase(logout.pending, setPending)
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.message = action.payload?.message || "Logged out successfully.";
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // GetMe
            .addCase(fetchMe.pending, setPending)
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = sanitizeUser(action.payload?.user);
                state.isAuthenticated = !!action.payload?.user;
                state.error = null;
            })
            .addCase(fetchMe.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    },
});

export const { clearAuth, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
