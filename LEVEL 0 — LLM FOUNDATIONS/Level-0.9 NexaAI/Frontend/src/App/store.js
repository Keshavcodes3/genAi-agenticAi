import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Authentication/Redux/auth.slice.js";
import chatReducer from "../Features/Chat/Redux/chat.slice.js";
import projectReducer from "../Features/Projects/Redux/project.slice.js"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        project: projectReducer
    },
});
