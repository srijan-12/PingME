import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const baseURL = import.meta.env.VITE_BASE_URL
const fullURL = baseURL+"/users/auth"

export const addUserToStore = createAsyncThunk('user/addUserToStore',async(arg,thunkAPI)=>{
    try {
        const result = await axios.get(fullURL, {withCredentials:true})
        return result?.data?.result   //this is payload
    } catch (error) {
        return thunkAPI.rejectWithValue("un-authorised")
    }
})


const userSlice = createSlice({
    name : "userInfo",
    initialState : {authState : false, currentUser : null, error: null},

    reducers : {
        addUser : (state, action) =>{
            return {authState: true, currentUser : {...action.payload}}
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(addUserToStore.fulfilled, (state,action)=>{                   //listening to asyncThunk function action if it gets fulfilled
            return {authState: true, currentUser : {...action.payload}, error :null}
        })
        .addCase(addUserToStore.rejected, (state, action)=>{                          //listening to asyncThunk function action if it gets rejected
            return {authState: false, currentUser: null, error: action.payload}
        })
    }
})

export const userReducer = userSlice.reducer
export const {addUser} = userSlice.actions