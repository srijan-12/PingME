import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux"
import { addUser, addUserToStore } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

export default function ProtectRoute({children}){
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
   const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+"/users/auth"
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    useEffect(()=>{

        async function checkForAuth(){
            dispatch(addUserToStore())
            if(user && !user.authState){
                navigate("/")
                toast.error(user.error)
            }else{
                setTimeout(()=>{
                    setLoading(false)
                },1000)
            }
        }
        checkForAuth()
    },[navigate])

    if (loading) return <div className="h-[100vh] w-full flex items-center justify-center">
        <SyncLoader/>
    </div>;

    return children
}