import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useEffect } from 'react'
import Login from './Login'
import Signup from './Signup'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
export const Home = () =>{

    const navigate = useNavigate()
    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+"/users/auth"

    async function pushUserToChats() {
        const result = await axios.get(fullURL, {withCredentials :true})
        if(result.status === 200 && !result.data.error){
            toast.success("Getting your chats ready")
            return setTimeout(()=>{
                navigate("/chats")
            },100)
            
        }else{
            console.log('error here');
            toast.error("Please login again")
            return setTimeout(()=>{
                navigate("/")
            },100)
        }
    }

    useEffect(()=>{
        pushUserToChats()
    },[navigate])


    return(
        <div className="container mx-auto w-[40%] min-w-[385px] my-auto">


            <div className="bg-white w-full p-6 rounded-xl text-center">
                <p className='font-semibold text-2xl'>PingME</p>
            </div>


            <div className="bg-white w-full p-6 rounded-xl mt-5">
                <TabGroup>
                <TabList className="w-full flex justify-around">
                    <Tab as={Fragment} >
                    {({ hover, selected }) => (
                        <button className={clsx('p-4 w-1/2 rounded-2xl',hover && 'underline', selected && 'bg-blue-200 text-black')}>Login</button>
                    )}
                    </Tab>
                    <Tab as={Fragment}>
                    {({ hover, selected }) => (
                        <button className={clsx('p-4 w-1/2 rounded-2xl',hover && 'underline', selected && 'bg-blue-200 text-black')}>Signup</button>
                    )}
                    </Tab>
                </TabList>
                    <TabPanels className="">
                        <TabPanel><Login/></TabPanel>
                        <TabPanel><Signup/></TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>

        </div>
    )
}
