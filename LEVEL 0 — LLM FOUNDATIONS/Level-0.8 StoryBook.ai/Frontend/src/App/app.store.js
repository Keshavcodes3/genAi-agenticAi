import { configureStore } from '@reduxjs/toolkit'

import authSlice from '../Features/Auth/Redux/auth.slice.js'
import chooseSlice from '../Features/Choose/Redux/choose.slice.js'
import storiesSlice from '../Features/Stories/Redux/stories.slice.js'

const store = configureStore({
    reducer: {
        auth: authSlice,
        choose: chooseSlice,
        stories: storiesSlice
    }
})

export default store