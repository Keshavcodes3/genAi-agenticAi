import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        error: false,
        loading: true
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        updateCredits: (state, action) => {
            if (state.user) {
                state.user.generationCredits = action.payload;
            }
        }
    }
})


export const { setError, setLoading, setUser, updateCredits } = authSlice.actions
export default authSlice.reducer