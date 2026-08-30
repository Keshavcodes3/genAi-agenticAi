import { createSlice } from '@reduxjs/toolkit'

export const chooseSlice = createSlice({
    name: "choose",
    initialState: {
        mood: '',
        genre: '',
        userPrompt: '',
        format: 'story',
        isBookmarked: false,
        currentCreation: null,
        creations: { stories: [], poems: [] },
        loading: false,
        error: null,
    },
    reducers: {
        setMood: (state, action) => {
            state.mood = action.payload
        },
        setGenre: (state, action) => {
            state.genre = action.payload
        },
        setFormat: (state, action) => {
            state.format = action.payload
        },
        setIsBookmarked: (state, action) => {
            state.isBookmarked = action.payload
            if (state.currentCreation) {
                state.currentCreation.isBookmarked = action.payload
            }
        },
        setUserPrompt: (state, action) => {
            state.userPrompt = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setCurrentCreation: (state, action) => {
            state.currentCreation = action.payload
        },
        setCreations: (state, action) => {
            state.creations = action.payload
        },
        clearCurrentCreation: (state) => {
            state.currentCreation = null
            state.mood = ''
            state.genre = ''
            state.userPrompt = ''
            state.format = 'story'
            state.isBookmarked = false
        }
    }
})

export const {
    setMood,
    setFormat,
    setGenre,
    setIsBookmarked,
    setUserPrompt,
    setLoading,
    setError,
    setCurrentCreation,
    setCreations,
    clearCurrentCreation
} = chooseSlice.actions

export default chooseSlice.reducer