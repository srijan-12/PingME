import { Button } from '@headlessui/react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Cookies from 'js-cookie';
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'

import ProfileModal from './ProfileModal'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { addChatToDisplay } from '../redux/slices/chatSlice';
import { addToNotificationArray, removeNotificationFromArray } from '../redux/slices/notification';


export default function ChatsHeader({user, sideDrawerVisiblity ,setSideDrawerVisiblity, setViewChatArea}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const notifArray = useSelector(state => state?.notification?.notificationArray)
    const[showNotification, setShowNotification] = useState(false)
    function logoutHandler(){
       Cookies.remove('token')
       toast.success("Logged out")
       setTimeout(()=>{
            navigate("/")
       },300)
    } 

    function openChatFromNotification(no){
        dispatch(addChatToDisplay(no?.chat))
        setViewChatArea(true)
        dispatch(removeNotificationFromArray(no._id))
        setShowNotification(false)
    }
    
    return(
        <>
            <div className="header w-[100%] h-fit bg-white p-4 flex justify-between items-center">
                    
                    <div className="div1" onClick={()=> setSideDrawerVisiblity(!sideDrawerVisiblity)}>

                        <Button className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-700 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-white data-open:bg-white border cursor-pointer">
                           <i className="fa-solid fa-user-plus"></i>
                           <span className='hidden md:inline'>
                                Search User
                           </span>
                        </Button>
                    </div>

                    <div className="div2">
                        <span className="text-2xl hidden sm:inline">Ping ME</span>
                        <i className="fa-brands fa-signal-messenger text-2xl ms-2"></i>
                    </div>

                    <div className="div3 flex items-center jsutify-around w-fit">

                        <div className='rounded-full p-2 w-15 h-15 py-5 mx-8 cursor-pointer' onClick={()=> setShowNotification(!showNotification)}>
                            <i className="fa-solid fa-bell mx-4 relative"></i> <div className="badge badge-sm badge-secondary absolute text-red-600 p-2 rounded-full px-2 top-5 right-33">{notifArray?.length}</div>
                        </div>

                            {showNotification && notifArray.length > 0 && <div className='bg-white w-[42%] sm:w-[35%] lg:w-[21%] p-2 absolute z-5 top-20 rounded-lg right-4 border border-gray-100'>
                                <Menu> 
                                    {notifArray.map((no)=>{
                                           return <MenuItem key={no._id} onClick = {()=> openChatFromNotification(no)}>
                                            <div className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-blue-200 text-black cursor-pointer hover:bg-blue-300 border border-gray-200 mt-2 me-2">
                                            <p className='text-xs'><span className='font-bold'>{no?.sender?.name}</span> sent you a message on {no?.chat?.isGroupChat ? <span className='font-bold'>{no?.chat?.chatName}</span> : null}</p>
                                        </div>
                                        
                                    </MenuItem>})}
                                </Menu>

                            </div> } {showNotification && notifArray.length <= 0 && <div className='bg-white w-[42%] sm:w-[35%] lg:w-[21%] p-2 absolute z-5 top-20 rounded-lg right-4 border border-gray-100'> <p className='text-xs'>No notification to show</p> </div> }
                        

                        {user?.currentUser?.picture ? (
                            <div className="avatar w-10 h-10 rounded-full me-2">
                                <img src={user.currentUser.picture} alt="" className="avatar w-10 h-10 rounded-full"/>
                            </div>
                            ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                            )}


                        <div className="w-fit text-right bg-white border rounded-lg">
                            <Menu>
                                <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-white data-open:bg-white">
                                <ChevronDownIcon className="size-4 fill-black/100" />
                                </MenuButton>

                                <MenuItems
                                transition
                                anchor="bottom end"
                                className="w-52 origin-top-right rounded-xl border border-black/5 mt-5 bg-white/100 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                >
                                <MenuItem>
                                    <div className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-blue-400 text-black cursor-pointer hover:bg-blue-400">
                                    <PencilIcon className="size-4 fill-black" />
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ProfileModal user={user} text={"My Profile"}/>
                                    </div>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-blue-400 text-black cursor-pointer" onClick={()=> logoutHandler()}>
                                    <Square2StackIcon className="size-4 fill-black" />
                                        Log out
                                    </button>
                                </MenuItem>
                                <div className="my-1 h-px bg-white/5" />
                                </MenuItems>
                            </Menu>
                        </div> 
                    </div>

                </div>
        </>
    )
}