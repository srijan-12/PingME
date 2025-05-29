import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import SkeletonX from "./SkeletonX";
import { addToChatHistory } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SideDrawer({ sideDrawerVisiblity, setSideDrawerVisiblity }) {
  const [searchVal, setSearchVal] = useState('');
  const [usersArray, setUsersArray] = useState([])
  const[loading, setLoading] = useState(false)
  const drawerRef = useRef(null);
    const baseURL = import.meta.env.VITE_BASE_URL
    const fullURL = baseURL+`/users/search?name=${searchVal}`
    const fullURLAccessChat = baseURL + "/chats/accessChat"
    const dispatch = useDispatch()

    async function handleCreateChat(id) {
        dispatch(addToChatHistory({chatWith : id}))
        setSideDrawerVisiblity(false)

    }

  async function handleSearch() {
    setLoading(true)
    if(!searchVal) {
        setLoading(false)
        return toast.error("Enter some keyword to search")
    }
    const result = await axios.get(fullURL, {withCredentials : true})
    // console.log(result?.data?.result?.length)
    if(result?.data?.result?.length > 0 && !result?.data?.result?.error){
        setTimeout(()=>{
            setUsersArray(result?.data?.result)
            return setLoading(false)
        },600)
    }else{
        setTimeout(()=>{
            setUsersArray([])
            toast.error("no user found")
            return setLoading(false)
        },600)
    }

  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setSideDrawerVisiblity(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSideDrawerVisiblity]);

  return (
    <>
      <div className="w-full h-full absolute flex top-0 z-10">
        <div ref={drawerRef} className="w-[300px] bg-[#FDFDFD] h-[99.2%]  overflow-y-scroll border border-gray-100">
            <div className="section1 p-4">
            <span className="text-xl">Search Users</span>
            </div>
            <div className="section2 p-2 flex justify-around">
            <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="border p-2 rounded-lg"
            />
            <button className="bg-blue-200 cursor-pointer p-2 rounded-lg" onClick={()=> handleSearch()}>Go</button>
            </div>
            <div className="section3">
                {loading ?<SkeletonX/> : 
                usersArray.map((user)=>{
                    return <div className="w-[90%] flex p-2 bg-gray-100 mx-auto justify-around rounded-lg cursor-pointer mt-2 hover:bg-[#40BAB5] hover:text-white" key={user?._id}
                            onClick={()=>handleCreateChat(user?._id)}
                    >
                        <div>
                            <img src={user?.picture} className="h-10 w-10 rounded-full"/>
                        </div>
                        <div>
                            <p className="font-bold">{user?.name}</p>
                            <p className="text-sm">email : {user?.email}</p>
                        </div>
                    </div>
                })}
            </div>
        </div>

        {/* <div className="flex-1 bg-black opacity-25">

        </div> */}

      </div>
    </>
  );
}
