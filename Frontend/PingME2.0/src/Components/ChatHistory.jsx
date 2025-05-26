import axios from "axios"
import { useEffect, useState } from "react"
import SkeletonX from "./SkeletonX"
import { useDispatch, useSelector } from "react-redux"
import { addChatToDisplay, fetchAllChatsFromBknd } from "../redux/slices/chatSlice"
import { toast } from "react-toastify"
import { NavLink } from "react-router-dom"
import CreateGrpChatModal from "./CreateGrpChatModal"

export default function ChatHistory({ viewChatArea , setViewChatArea }){

    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+"/chats/allChats"
    const[chatHistoryArray, setChatHistoryArray] = useState([])

    const allChatsFromStore = useSelector(state => state.chat)
    const currentUserId = useSelector(state => state?.user?.currentUser?._id)
    // console.log(currentUserId,"top")
    const {allChat, displayChat,error,loading} = allChatsFromStore
    // console.log(allChat, displayChat,error,loading)

    useEffect(() => {
        if (error) {
          toast.error(error);
        }
      }, [error]);
     // fetch krke store update hona chyea
    const dispatch = useDispatch()

    useEffect(()=>{
        // console.log(allChatsFromStore, "this is store data")
        setChatHistoryArray(allChatsFromStore)
    },[allChatsFromStore])


    useEffect(()=>{
        fetchingChats()
    },[])


    
    //backend se data fetch kr k display kr reh
    async function fetchingChats(){
        dispatch(fetchAllChatsFromBknd())
        // try {
        //     const result = await axios.get(fullURL,{withCredentials:true})
        //     console.log(result?.data?.result, "this is backend fetched data")
        //     setTimeout(()=>{
        //         setLoading(false)
        //         setChatHistoryArray(result?.data?.result)
        //     },600)
        // } catch (error) {
        //     setLoading(false)
        //     console.log(error)
        // }
    }

    const[screenSize, setScreenSize] = useState(window.innerWidth)
    
    useEffect(()=>{
            window.addEventListener('resize', ()=> setScreenSize(window.innerWidth));
        return ()=>{
            window.removeEventListener('resize', setScreenSize(window.innerWidth));
        }
    },[])

    //chat area mai profile update k liye hai
    function addChatToDisplayFN(chat){
        dispatch(addChatToDisplay(chat))
        setViewChatArea(true)
    }
    return (
        
        <>
            <div className={`bg-white w-full sm:w-[30%] sm:min-w-[234px] m-2 rounded-lg h-[91vh] max-h-[91vh] flex flex-col ${screenSize <= 639 && viewChatArea ? "hidden" : ""}`}>
                <div className="section1 flex justify-between p-4 items-center">
                    <div className="rounded-lg hover:bg-[#40BAB6] cursor-pointer hover:text-white">
                        <p className="text-3xl">My Chats</p>
                    </div>

                    <div>
                        <div className="p-3 bg-[#EBEBEB] rounded-lg hover:bg-[#40BAB6] cursor-pointer hover:text-white">
                            <CreateGrpChatModal text = {"Create Group"}/>
                        </div>
                    </div>
                </div>

                <div className="section2 p-4 overflow-y-scroll">
                    {loading ? <SkeletonX/> : chatHistoryArray.allChat?.map((chat)=>{
                        return (
                            <div
                                className={`cursor-pointer mb-2 rounded-lg flex gap-2 items-center h-fit py-1 px-2
                                    ${displayChat?._id === chat?._id ? "bg-[#40BAB6] text-white" : "bg-[#EBEBEB] hover:bg-[#40BAB6] hover:text-white"}`}
                                key={chat?._id}
                                onClick={() => addChatToDisplayFN(chat)}
                                >
                                <div className="h-10 w-10 rounded-full">
                                    <img src="" />
                                </div>

                                <div className="flex flex-col">
                                    {chat?.isGroupChat ? (
                                        <div>{chat?.chatName}</div>
                                    ) : (
                                        <div>{chat?.users?.filter((u) => u?._id !== currentUserId)[0].name}</div>
                                    )}

                                    {/* error */}
                                    {chat?.latestMessage ? <div className="text-xs">

                                        {currentUserId !== chat?.latestMessage?.sender?._id ? <span className="font-semibold me-2">{chat?.latestMessage?.sender?.name}</span> : <span className="font-semibold me-2">You : </span>}
                                        {chat?.latestMessage?.content}
                                        
                                        </div> : null}
                                </div>

                               
                            </div>

                        )
                    })}
                </div>
            </div>
        </>
    )
}
// 

