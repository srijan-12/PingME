import { useSelector } from "react-redux"
import ProfileModal from "./ProfileModal"
import { useEffect, useState } from "react"
import CreateGrpChatModal from "./CreateGrpChatModal"
import GrpChatDetailModal from "./GrpChatDetailModal"
import { MoonLoader } from "react-spinners"
import axios from "axios"

export default function ChatArea({ viewChatArea , setViewChatArea }){
    const chat = useSelector(state => state.chat)
    const currentUserId = useSelector(state => state?.user?.currentUser?._id)
    const extractedUser = chat?.displayChat?.users?.filter((u)=> u?._id !== currentUserId)

    const[messages, setMessages] = useState([]);
    const[loading, setLoading] = useState(true);
    const[newMessage, setNewMessage] = useState();
    const[screenSize, setScreenSize] = useState(window.innerWidth)
    const[userInputMessage, setUserInputMessage] = useState('')

    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+`/message/fetchAllMessages/${chat?.displayChat?._id}`
    const sendmessageURL = baseURL + "/message/sendMessage"
       
       useEffect(()=>{
               window.addEventListener('resize', ()=> setScreenSize(window.innerWidth));
           return ()=>{
               window.removeEventListener('resize', setScreenSize(window.innerWidth));
           }
       },[])

       useEffect(()=>{
            const fetchAllMessages = async() =>{
                try {
                    const result = await axios.get(fullURL, {withCredentials:true})
                    console.log(result?.data?.result)
                    setTimeout(()=>{
                        setMessages(result?.data?.result)
                        setLoading(false)
                    },300)
                } catch (error) {
                    console.log(error.message)
                }
            }
            if(!chat?.displayChat?._id){
                return
            }
            fetchAllMessages();
       },[chat?.displayChat])

       const typingHandler = (e) => {
            setUserInputMessage(e.target.value)
       }

       const sendMessageFn = async(e) =>{
        if(e.key === 'Enter' && userInputMessage.trim()){
            try {
                console.log('enter');
                const result = await axios.post(sendmessageURL, {content : userInputMessage, chatId : chat?.displayChat?._id}, {withCredentials:true})
                console.log(result?.data?.result)
                setUserInputMessage('')
                setMessages((pre) => [...pre, result?.data?.result])
            } catch (error) {
                console.log(error.message)
            }
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
                    <p className="text-2xl">{chat?.displayChat?.chatName}</p>
                        <div>
                           
                            {!chat?.displayChat?.isGroupChat ? <ProfileModal user = {extractedUser} text={ <i className="fa-solid fa-eye sm:p-4 cursor-pointer"></i>}/> : <GrpChatDetailModal text={ <i className="fa-solid fa-eye sm:p-4 cursor-pointer"></i>}/>}
                    
                        </div>
                </div>


                {/* render messages here */}
                <div className="section2 bg-gray-200 w-[98%] mx-auto rounded-lg p-4 h-[86%] flex flex-col justify-between">
                    <div className="h-[92%]">

                    {loading ? <div className="w-full h-full flex justify-center items-center"><MoonLoader color="black"/></div> : <div className="bg-red-200 h-full w-full overflow-y-scroll">
                            {messages?.map((msg)=>{
                                return <div className="flex gap-2" key={msg?._id}> 
                                    <div>img</div>
                                    <div>{msg?.content}</div>
                                </div>
                            })}
                        </div>}


                    </div>
                    <input type="text" placeholder="Enter message" className="p-4 border outline-none rounded-lg w-full mt-2" value={userInputMessage} onChange={(e)=> typingHandler(e)} onKeyDown={(e)=> sendMessageFn(e)}/>
                </div>
                </> : <div className="w-fit m-auto mt-[40%] p-2"><p className="text-6xl font-thin">Click on user to start chatting</p></div>}
                
            </div>
        </>
    )
}