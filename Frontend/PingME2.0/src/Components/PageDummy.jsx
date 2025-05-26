import { useEffect } from "react"
import axios from "axios"
export const PageDummy = () =>{


    async function fetchChats() {
        const data = await axios.get("http://localhost:3001/api/chatData")
        console.log(data.data)
    }

    useEffect(()=>{
        fetchChats()
    },[])



    return (
        <>
            this is dummy page
        </>
    )
}