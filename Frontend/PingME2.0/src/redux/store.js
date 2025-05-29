import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./slices/userSlice"
import { chatReducer } from "./slices/chatSlice"
import { notificationReducer } from "./slices/notification"
export const store = configureStore({
    reducer:{
        user : userReducer,
        chat : chatReducer,
        notification : notificationReducer
    }
})