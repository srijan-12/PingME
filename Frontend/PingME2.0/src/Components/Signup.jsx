import { useState } from "react"
import axios from 'axios'
import { toast } from 'react-toastify';
import {SyncLoader} from "react-spinners"
import {useNavigate} from 'react-router-dom'
export default function Signup(){
    const[name, setName] = useState('test')
    const[email, setEmail] = useState('test1231@gmail.com')
    const[password, setPassword] = useState('testX@123XXY$#')
    const[confirmPassword, setConfirmPassword] = useState('testX@123XXY$#')
    const [gender, setGender] = useState("Male");
    const[picture, setPicture] = useState("")
    const[loading, setLoading] = useState(false)
    const[passVisible, setPassVisible] = useState(false)
    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+"/users/signup"
    const navigate = useNavigate()
    async function formSubmitHandler(e){
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password",password)
        formData.append("confirmPassword",confirmPassword)
        formData.append("gender",gender)
        if(picture){
            formData.append("picture",picture)
        }
        try {
            const res = await axios.post(fullURL, formData, {withCredentials:true, headers: {
                "Content-Type": "multipart/form-data",
              }})
            setLoading(false)
            toast.success(res?.data.result)
            setTimeout(()=>{
                navigate('/chats')
            },1000)
            //navigate to chats page of that user
        } catch (error) {
            setTimeout(()=>{setLoading(false)},1500)
            if(error?.response?.data?.error.substring(7,20) === "duplicate key"){
                return toast.error("User already registered");
            }
            return toast.error(error.response?.data?.error || "Something went wrong!");
        }
    }
    return(
        <>
             <form encType="multipart/form-data" onSubmit={(e)=>formSubmitHandler(e)}>
                <div className="flex flex-col mt-5">


                    <label htmlFor="name" className="font-semibold">Enter your full name</label>
                    <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="John Doe"  className="p-4 border border-gray-200 mb-5 rounded-lg mt-2" required/>

                    <label htmlFor="email" className="font-semibold">Enter e-mail</label>
                    <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="e.g jhondoe@gmail.com"  className="p-4 border border-gray-200 mb-5 rounded-lg mt-2" required/>


                   <div className="relative w-full">
                        <label htmlFor="password" className="font-semibold">Enter password</label>
                        <input type={passVisible ? "text" : "password"} value={password} id="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter password" className="p-4 border border-gray-200 mb-5 rounded-lg w-full mt-2"/>
                        <div className="absolute top-1/2  transform -translate-y-1/3 right-4 text-gray-500 cursor-pointer">
                            {passVisible ? <i className="fa-solid fa-eye-slash" onClick={()=> setPassVisible(!passVisible)}></i> : <i className="fa-solid fa-eye" onClick={()=> setPassVisible(!passVisible)}></i>}
                        </div>
                   </div>
                   
                   <div className="relative w-full">
                        <label htmlFor="confirmPassword" className="font-semibold">Enter Confirm password</label>
                        <input type={passVisible ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Enter confirm password"  className="p-4 border border-gray-200 mb-5 rounded-lg w-full mt-2" required/>
                        <div className="absolute top-1/2  transform -translate-y-1/3 right-4 text-gray-500 cursor-pointer">
                            {passVisible ? <i className="fa-solid fa-eye-slash" onClick={()=> setPassVisible(!passVisible)}></i> : <i className="fa-solid fa-eye" onClick={()=> setPassVisible(!passVisible)}></i>}
                        </div>
                   </div>

                   <label htmlFor="gender" className="font-semibold">Gender</label>
                   <select id="gender" className="p-4 border border-gray-200 mb-5 rounded-lg mt-2" required value={gender} onChange={(e)=>setGender(e.target.value)} placeholder="gender">
                        <option value="" disabled>
                            -- Select Gender --
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                   </select>
                   

                    <label htmlFor="picture" className="font-semibold">Choose your profile picture</label>
                    <input type="file" id="picture" accept="image/*" onChange={(e)=>setPicture(e.target.files[0])} className="p-4 border border-gray-200 mb-5 rounded-lg mt-2" />

                   <button type="submit" className="p-4 bg-[#388ED1] text-white rounded-lg font-medium mt-2 mb-5 cursor-pointer">{loading ? <SyncLoader/> : "Signup"}</button>
                </div>
            </form>
        </>
    )
}
