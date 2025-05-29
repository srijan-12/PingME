import ChatsHeader from "./ChatsHeader"
import ProtectRoute from "./ProtectRoute"

import { useSelector } from "react-redux"
import SideDrawer from "./SideDrawer"
import { useState } from "react"
import ChatHistory from "./ChatHistory"
import ChatArea from "./ChatArea"
const Chats =() =>{

    const user = useSelector(state => state.user)
    const[sideDrawerVisiblity, setSideDrawerVisiblity] = useState(false)
    const[viewChatArea, setViewChatArea] = useState(false)

    // window.addEventListener('resize', () => {
    //     console.log("Screen width changed to:", window.innerWidth);
    //   });
      
    return(
        <>
           <div className="main w-full h-full flex flex-col">
                {user && <ChatsHeader user={user} sideDrawerVisiblity= {sideDrawerVisiblity} setSideDrawerVisiblity ={setSideDrawerVisiblity}  setViewChatArea = {setViewChatArea}/>}
                {user && sideDrawerVisiblity && <SideDrawer user={user} sideDrawerVisiblity= {sideDrawerVisiblity} setSideDrawerVisiblity ={setSideDrawerVisiblity}/>}
                {user && <div className="flex justify-around me-2">
                    <ChatHistory viewChatArea= {viewChatArea} setViewChatArea = {setViewChatArea}/>
                    <ChatArea viewChatArea= {viewChatArea} setViewChatArea = {setViewChatArea}/>
                    </div>}
           </div>
        </>
    )
}

export default Chats



