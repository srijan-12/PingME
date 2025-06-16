import axios from "axios"
import { useState } from "react"
import { toast } from 'react-toastify';
import {SyncLoader} from "react-spinners"
import { useNavigate } from "react-router-dom";

export default function Login(){
    const[email, setEmail] = useState('test123@gmail.com')
    const[password, setPassword] = useState('testX@123XXY$#')
    const[passVisible, setPassVisible] = useState(false)
    const[activeGuest, setActiveGuestMode] = useState(false)
    const[loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const guestEmail = "guest@gmail.com"
    const guestPassword = "testX@123XXY$#"
    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+"/users/login"
    async function handleLoginSubmit(e) {
        setLoading(true)
        e.preventDefault()
        try {
            if(activeGuest){
                const res = await axios.post(fullURL, {email:guestEmail, password:guestPassword}, {withCredentials : true})
                setLoading(false);
                toast.success(res?.data?.result)
                setTimeout(()=>{
                    navigate('/chats')
                },1000)
            }else{
                const res = await axios.post(fullURL, {email, password}, {withCredentials : true})
                setLoading(false)
                toast.success(res?.data?.result)
                setTimeout(()=>{
                    navigate('/chats')
                },1000)
            }
            // navigate to /chats
        } catch (error) {
            console.log(error?.response?.data)
            return toast.error(error?.response?.data?.error)
        }
    }

    return(
        <>
            <form onSubmit={(e)=> handleLoginSubmit(e)}>
                <div className="flex flex-col mt-5">
                    <label htmlFor="email" className="font-semibold">Enter e-mail</label>
                    <input type="text" id="email" value={activeGuest ? guestEmail : email} onChange={(e)=>setEmail(e.target.value)} placeholder="e.g jhondoe@gmail.com"  className="p-4 border border-gray-200 mb-5 rounded-lg mt-2" required/>
                   <div className="relative w-full">
                        <label htmlFor="password" className="font-semibold">Enter password</label>
                        <input type={passVisible ? "text" : "password"} value={activeGuest ? guestPassword : password} id="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter password" className="p-4 border border-gray-200 mb-5 rounded-lg w-full mt-2"/>
                        <div className="absolute top-1/2 transform -translate-y-1/3 right-4 text-gray-500 cursor-pointer">
                            {passVisible ? <i className="fa-solid fa-eye-slash" onClick={()=> setPassVisible(!passVisible)}></i> : <i className="fa-solid fa-eye" onClick={()=> setPassVisible(!passVisible)}></i>}
                        </div>
                   </div>
                   <button type="submit" className="p-4 bg-[#388ED1] text-white rounded-lg font-medium mt-2 mb-5 cursor-pointer">{loading ? <SyncLoader/> : "Login"}</button>
                   <button type="button" className="p-4 bg-[#E44545] text-white rounded-lg font-medium mt-2 mb-5 cursor-pointer" onClick={()=> setActiveGuestMode(!activeGuest)}>{activeGuest? "Remove guest user credentials":"Get guest user credentials"}</button>
                </div>
            </form>
        </>
    )
}
