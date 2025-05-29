import { useDispatch, useSelector } from "react-redux"
import ProfileModal from "./ProfileModal"
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import GrpChatDetailModal from "./GrpChatDetailModal"
import { MoonLoader, SyncLoader } from "react-spinners"
import axios from "axios"
// import io from 'socket.io-client'
import socket from "../socket";
import NoChatsPage from "./NoChatsPage";
import { useRef } from "react";
import { useMemo } from "react";
import { debounce } from "lodash";
import { addChatToDisplay, fetchAllChatsFromBknd, updateLatestMessage } from "../redux/slices/chatSlice";
import { addToNotificationArray } from "../redux/slices/notification";

export default function ChatArea({ viewChatArea , setViewChatArea }){
    // const socket = useRef(null);
    const selectedChatCompare = useRef(null)
    const latestMessageRef = useRef(null)
    const chat = useSelector(state => state.chat)
    const currentUserId = useSelector(state => state?.user?.currentUser?._id)
    const notifArray = useSelector(state => state?.notification?.notificationArray)
    const dispatch = useDispatch()
    const extractedUser = chat?.displayChat?.users?.filter((u)=> u?._id !== currentUserId)

    const[messages, setMessages] = useState([]);
    const[loading, setLoading] = useState(true);
    const[socketConnected, setSocketConnected] = useState(false);
    const[screenSize, setScreenSize] = useState(window.innerWidth)
    const[userInputMessage, setUserInputMessage] = useState('')
    const[typing, setTyping] = useState(false)
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);

    // const[stopTyping, setStopTyping] = useState(false)

    const scrollContainerRef = useRef(null);


    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+`/message/fetchAllMessages/${chat?.displayChat?._id}`
    const sendmessageURL = baseURL + "/message/sendMessage"



    useEffect(() => {
        const scrollEl = scrollContainerRef.current;
        if (scrollEl) {
            scrollEl.scrollTop = scrollEl.scrollHeight;
        }
        }, [messages]);



    useEffect(()=>{
        // socket = io('http://localhost:3001');

        socket.emit('joinApplication', currentUserId)
        socket.on('joinedApplicationSucessfully', ()=>{
            // console.log('user joined our app')
            setSocketConnected(true)
        })
        socket.on('typing', (roomId)=> {
            if(selectedChatCompare?.current?._id === roomId){
                setIsSomeoneTyping(true)
            }
            
        })
        socket.on('stop typing', ()=> setIsSomeoneTyping(false))

        socket.on('Group created', ()=> dispatch(fetchAllChatsFromBknd()))

        socket.on('leave group', ()=> dispatch(fetchAllChatsFromBknd()))
        socket.on('update group', ()=> dispatch(fetchAllChatsFromBknd()))
        socket.on('added to group', ()=> dispatch(fetchAllChatsFromBknd()))
        
    },[])

       
       useEffect(()=>{
               window.addEventListener('resize', ()=> setScreenSize(window.innerWidth));
           return ()=>{
               window.removeEventListener('resize', setScreenSize(window.innerWidth));
           }
       },[])



       useEffect(()=>{
            const fetchAllMessages = async() =>{
                if(!chat?.displayChat?._id){
                return
            }
                try {
                    const result = await axios.get(fullURL, {withCredentials:true})
                    // console.log(result?.data?.result)
                    setTimeout(()=>{
                        setMessages(result?.data?.result)
                        socket.emit("join room", chat?.displayChat?._id)
                        // socket.emit('leave chat', )
                        setLoading(false)
                    },300)
                } catch (error) {
                    console.log(error.message)
                    toast.error(error.message)
                }
            }
            fetchAllMessages();

            selectedChatCompare.current = chat?.displayChat   //for notification purpose

       },[chat?.displayChat])

       useEffect(()=>{
        //   console.log(latestMessageRef.current)
          if(latestMessageRef.current !== null){
            // dispatch(updateLatestMessage(latestMessageRef?.current))
            dispatch(fetchAllChatsFromBknd())
          }else{
            return
          }
          
       },[latestMessageRef.current])

       //for recieving messages
       useEffect(()=>{
        socket.on('recieve message', (messageData)=>{
            console.log('recieving')
            if(!selectedChatCompare.current || selectedChatCompare.current._id !== messageData?.chat?._id){
                console.log('notification for you')
                dispatch(addToNotificationArray(messageData))
                dispatch(fetchAllChatsFromBknd())
            }else{
                if(messages?.length > 0) {
                      
                    setMessages((pre) => [...pre, messageData])
                     
                }else{
                    setMessages([messageData])
                }
            }
            latestMessageRef.current = messageData
        })

        return ()=> socket.off('recieve message')
    })

    
    const debounceTyping = useMemo(()=>{
                return debounce(()=>{
                    socket.emit('stop typing', selectedChatCompare.current._id)
                    setTyping(false)
                },700)
            },[userInputMessage])

       const typingHandler = (e) => {
            setUserInputMessage(e.target.value)
            if(!socketConnected){
                return console.log('socket not connected yet')
            }
            if(!typing){
                setTyping(true)
                socket.emit('typing', selectedChatCompare.current._id)
            }
            debounceTyping()
       }

       const sendMessageFn = async(e) =>{
        if((e?.key && e.key !== 'Enter') || !userInputMessage.trim()){
            return
        }
        try {
                // console.log('enter');
                const result = await axios.post(sendmessageURL, {content : userInputMessage, chatId : chat?.displayChat?._id}, {withCredentials:true})
                // console.log(result?.data?.result)
                socket.emit('send message', result?.data?.result)
                latestMessageRef.current = result?.data?.result
                setUserInputMessage('')
                if(messages?.length > 0) {
                    setMessages((pre) => [...pre, result?.data?.result])
                }else{
                    setMessages([result?.data?.result])
                }
                
            } catch (error) {
                console.log(error.message)
            }
       }


    return (
        <>
            <div className={`sm:block flex-1 h-[91vh] bg-white mt-2 rounded-lg ${screenSize <= 639 && viewChatArea ? "block" : "hidden"}`}>

                {chat?.displayChat ? <>
                {/* make chat.displayChat = null */}
                    <div className="block sm:hidden p-2 rounded-full cursor-pointer hover:bg-gray-200 w-fit mt-1 ms-2" onClick={()=> setViewChatArea(false)}> 
                    <i className="fa-solid fa-arrow-left text-2xl"></i>
                </div>

                <div className="section1 flex justify-between sm:p-4 bg-white mx-4 bg-red-100 mb-4 sm:mb-2">
                    {/* {extractedUser[0]?.name} */}
                    <p className="text-2xl">{chat?.displayChat?.isGroupChat ? chat?.displayChat?.chatName : extractedUser[0]?.name}</p>    
                        <div>
                           
                            {!chat?.displayChat?.isGroupChat ? <ProfileModal user = {extractedUser} text={ <i className="fa-solid fa-eye sm:p-4 cursor-pointer"></i>}/> : <GrpChatDetailModal text={ <i className="fa-solid fa-eye sm:p-4 cursor-pointer"></i>}/>}
                    
                        </div>
                </div>


                {/* render messages here */}
                <div className="section2 bg-gray-100 w-[98%] mx-auto rounded-lg p-4 h-[85%] flex flex-col justify-between">
                    <div className="h-[84%]">

                    {loading ? <div className="w-full h-full flex justify-center items-center"><MoonLoader color="black"/></div> : <div ref={scrollContainerRef} className="h-full w-full overflow-y-scroll">
                            {messages?.map((msg, idx)=>{
                                const nextMsg = messages[idx + 1];
                                const LastMessageBySender = !nextMsg || msg?.sender?._id !== nextMsg?.sender?._id
                                return <div className="" key={msg?._id}> 
                                    {msg?.sender?._id === currentUserId ? <>
                                        <div className="chat chat-end">
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                            {LastMessageBySender && <img
                                                alt="Pic"
                                                src={msg?.sender?.picture}
                                            />}
                                            </div>
                                        </div>
                                        <div className="chat-header">
                                            You
                                            <time className="text-xs opacity-50">
                                                {new Date(msg?.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                            </time>
                                        </div>
                                        <div className="chat-bubble bg-[#00D2BC]">{msg?.content}</div>
                                        </div>
                                        </> :  <>
                                                    <div className="chat chat-start">
                                                        <div className="chat-image avatar">
                                                            <div className="w-10 rounded-full">
                                                            {LastMessageBySender && <img
                                                                alt="Pic"
                                                                src={msg?.sender?.picture}
                                                            />}
                                                            </div>
                                                        </div>
                                                        <div className="chat-header">
                                                            {msg?.sender?.name}
                                                            <time className="text-xs opacity-50">
                                                                {new Date(msg?.createdAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: false,
                                                                })}
                                                            </time>
                                                        </div>
                                                        <div className="chat-bubble bg-[#00BAFE]">{msg?.content}</div>
                                                        </div>
                                                    </>}
                                </div>
                            })}
                        </div>}


                    </div>
                    
                    <div className="p-2 min-h-[5vh]">{isSomeoneTyping && <SyncLoader size={'5px'}/>}</div>
                    <div className="flex gap-4 h-fit justify-between items-center">
                        <input type="text" placeholder="Enter message" className="p-4 border outline-none rounded-lg w-full mt-2" value={userInputMessage} onChange={(e)=> typingHandler(e)} onKeyDown={sendMessageFn}/> 

                        <div className="h-12 w-15 rounded-lg bg-[#40BAB6] text-white flex items-center justify-center cursor-pointer hover:bg-[#127a76]" onClick={sendMessageFn}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    
                </div>
                </> : <NoChatsPage/>}
                
            </div>
        </>
    )
}


