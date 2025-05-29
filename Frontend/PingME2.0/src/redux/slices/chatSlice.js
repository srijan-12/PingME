import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { reject } from "lodash";
import { useSelector } from "react-redux";

const baseURL = import.meta.env.VITE_BASE_URL
const fullURLAccessChat = baseURL + "/chats/accessChat"
const fullURL = baseURL+"/chats/allChats"
const fullURLRemove = baseURL + "/chats/removeUser"
const fullURLAdd = baseURL + "/chats/addUser"
const fullURLRename = baseURL + "/chats/renameGroup"
//create chat if not exists and either way adding it to allChats array
export const addToChatHistory = createAsyncThunk('chats/addToChatHistory', async({chatWith}, thunkAPI)=>{
    try {
        const result = await axios.post(fullURLAccessChat, {chatWithUserId : chatWith}, {withCredentials : true})
        return result.data.result
    } catch (error) {
        return thunkAPI.rejectWithValue("failed to create chat")
    }
})

export const fetchAllChatsFromBknd = createAsyncThunk('chats/fetchAllChatsFromBknd', async(_, thunkAPI)=>{
    try {
        const result = await axios.get(fullURL, {withCredentials : true})
        return result?.data?.result
    } catch (error) {
        return thunkAPI.rejectWithValue("failed to fetch chat")
    }
})

export const createGrpChat = createAsyncThunk('chats/createGrpChat', async({grpName, usersArrayToSend}, thunkAPI)=>{
    try {
        const fullURL = baseURL + '/chats/createGroupChat'
        const result = await axios.post(fullURL, {groupName: grpName, usersArray : usersArrayToSend}, {withCredentials:true});
        return result?.data?.result
    } catch (error){
        return thunkAPI.rejectWithValue(error?.response?.data?.error);
    }
})

export const removeFromGrpChat = createAsyncThunk('chats/removeFromGrpChat', async({chatId, userId, boolVal}, thunkAPI)=>{
    try {
        const result = await axios.patch(fullURLRemove, {chatId, userId}, {withCredentials : true})
        return {result : result?.data?.result, boolVal}
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data?.error);
    }
})

export const adduserToGrp = createAsyncThunk('chats/adduserToGrp', async({chatId, userId}, thunkAPI)=>{
    try {
        const result = await axios.patch(fullURLAdd, {chatId, userId}, {withCredentials: true})
        return result?.data?.result
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data?.error)
    }
})

export const updateGrpName = createAsyncThunk("chats/updateGrpName", async({chatId, newGroupName}, thunkAPI)=>{
    try {
        const result = await axios.patch(fullURLRename, {chatId, newGroupName}, {withCredentials:true})
        return result?.data?.result
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data?.error)
    }
})



const chatSlice = createSlice({
    name : "chats",
    initialState : {allChat : [], error : null, displayChat : null, loading : true},

    reducers : {
        addChatToDisplay : (state, action) =>{
            state.displayChat = action.payload
        },
        settingError : (state, action) =>{
            state.error = null;
        },
        updateLatestMessage: (state, action) => {
            state.displayChat = {
                ...state.displayChat,
                latestMessage: action.payload,
            };
        }


    },

    extraReducers : (builder)=>{
        builder.addCase(addToChatHistory.fulfilled, (state, action)=>{
            state.loading = false;
            const newArr = state.allChat.filter((chat)=> chat._id !== action.payload._id)
            newArr.unshift(action.payload)
            // console.log(state.allChat)
            state.allChat = newArr
        })
        .addCase(addToChatHistory.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchAllChatsFromBknd.fulfilled, (state, action)=>{
            state.loading = false;
            state.allChat = action.payload
        })
        .addCase(fetchAllChatsFromBknd.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createGrpChat.fulfilled, (state, action)=>{
            state.loading = false;
            const newArr = state.allChat.filter((chat)=> chat._id !== action.payload._id)
            newArr.unshift(action.payload)
            state.allChat = newArr
        })
        .addCase(createGrpChat.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
        })
        .addCase(removeFromGrpChat.fulfilled, (state, action)=>{
            state.loading = false;
            if(action.payload.boolVal){
                state.allChat = state.allChat.filter((chat)=> chat._id !== action.payload.result._id)
                state.displayChat = null
            }else{
                const idx = state.allChat.findIndex((chat)=> chat._id === action.payload.result._id)
                state.allChat.splice(idx, 1, action.payload.result)
            }
        })
        .addCase(removeFromGrpChat.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
        })
        .addCase(adduserToGrp.fulfilled, (state, action)=>{
            state.loading = false;
            const idx = state.allChat.findIndex((chat)=> chat._id === action.payload._id)
            state.allChat.splice(idx, 1, action.payload)
        })
        .addCase(adduserToGrp.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
        })
        .addCase(updateGrpName.fulfilled, (state, action)=>{
            state.loading = false;
            const idx = state.allChat.findIndex((chat)=> chat._id === action.payload._id)
            state.allChat.splice(idx, 1, action.payload)
        })
        .addCase(updateGrpName.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
        })
    }
})

export const chatReducer = chatSlice.reducer
export const {addChatToDisplay, settingError, updateLatestMessage} = chatSlice.actions




