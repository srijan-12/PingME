import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name : 'notification',
    initialState : {notificationArray : []},
    reducers : {
        addToNotificationArray : (state,action) =>{
            state.notificationArray.unshift(action.payload)
        },
        removeNotificationFromArray : (state, action) =>{
            state.notificationArray = state.notificationArray.filter((n)=> n._id !== action.payload)
        }
    }
})

export const {addToNotificationArray, removeNotificationFromArray} = notificationSlice.actions
export const notificationReducer = notificationSlice.reducer