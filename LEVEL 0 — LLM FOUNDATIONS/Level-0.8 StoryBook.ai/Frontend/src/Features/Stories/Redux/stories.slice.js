import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import storiesService from "../Service/storiesService"

export const fetchTotalStats = createAsyncThunk(
  'stories/fetchTotalStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storiesService.getTotalStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchRecentWorks = createAsyncThunk(
  'stories/fetchRecentWorks',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await storiesService.getRecentWorks(limit)
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const fetchAllContent = createAsyncThunk(
  'stories/fetchAllContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storiesService.getAllContent()
      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    totalStats: {
      totalStories: 0,
      totalPoems: 0,
      totalCreations: 0
    },
    recentWorks: [],
    allContent: {
      stories: [],
      poems: []
    },
    loading: false,
    statsLoading: false,
    recentWorksLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetStories: (state) => {
      state.totalStats = {
        totalStories: 0,
        totalPoems: 0,
        totalCreations: 0
      }
      state.recentWorks = []
      state.allContent = {
        stories: [],
        poems: []
      }
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch Total Stats
    builder
      .addCase(fetchTotalStats.pending, (state) => {
        state.statsLoading = true
        state.error = null
      })
      .addCase(fetchTotalStats.fulfilled, (state, action) => {
        state.statsLoading = false
        state.totalStats = action.payload
      })
      .addCase(fetchTotalStats.rejected, (state, action) => {
        state.statsLoading = false
        state.error = action.payload
      })

    // Fetch Recent Works
    builder
      .addCase(fetchRecentWorks.pending, (state) => {
        state.recentWorksLoading = true
        state.error = null
      })
      .addCase(fetchRecentWorks.fulfilled, (state, action) => {
        state.recentWorksLoading = false
        state.recentWorks = action.payload
      })
      .addCase(fetchRecentWorks.rejected, (state, action) => {
        state.recentWorksLoading = false
        state.error = action.payload
      })

    // Fetch All Content
    builder
      .addCase(fetchAllContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading = false
        state.allContent = action.payload
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, resetStories } = storiesSlice.actions
export default storiesSlice.reducer
