import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios, { all } from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { adduserToGrp, createGrpChat, fetchAllChatsFromBknd, removeFromGrpChat, settingError, updateGrpName } from '../redux/slices/chatSlice';
import { ClipLoader } from 'react-spinners';
import { useEffect } from 'react';
import socket from '../socket';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function GrpChatDetailModal({text}) {
  const {allChat, error, loading, displayChat} = useSelector(state => state.chat)
  const loggedInUserId = useSelector(chat => chat.user?.currentUser?._id)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const[grpName, setGrpName] = React.useState('');
  const[searchUserIp, setSearchUserIp] = React.useState('')
  const[fetchedUserFromQuery, setFetchedUserFromQuery] = React.useState([])
  const[loadingSearch, setLoadingSearch] = React.useState(false)

  const[usersArrayToSend, setUsersArrayToSend] = React.useState(displayChat?.users)
  const grpAdminId = displayChat?.groupAdmin?._id
  

  //displaying error occurs during dispatching an action
  React.useEffect(() => {
    if(error){
        toast.error(error)
        dispatch(settingError())
      }
  }, [error]);

  


    const baseURL = import.meta.env.VITE_BASE_URL
    


    const debouncedSearch = React.useMemo(()=>{
        return debounce(async(query)=>{
            setLoadingSearch(true)
            if(!query) {
                setFetchedUserFromQuery([])
                setLoadingSearch(false)
                return
            }
            try {
                const fullURL = baseURL+`/users/search?name=${query}`
                const result = await axios.get(fullURL, {withCredentials : true})
                if(result?.data?.result.length === 0 && result.status === 200){
                    setTimeout(()=>{
                        toast.error("No user found")
                        setLoadingSearch(false)
                        return
                    },300)
                }
                setTimeout(()=>{
                    setFetchedUserFromQuery(result?.data?.result)
                    setLoadingSearch(false)
                    return
                },300)
            } catch (error) {
                console.log(error.message);
            }
        },300)
    },[baseURL])


    //when component unmounts remove the debouncing 
    React.useEffect(()=>{
        return ()=>debouncedSearch.cancel()
    },[debouncedSearch])




    //searching user
    function inputChangeHandler(value){
        setSearchUserIp(value);
        debouncedSearch(value)
    }



    //adding user to conversation
    function userClickHandler(user) {
        setUsersArrayToSend(prevArray => {
          const exists = prevArray.some(u => u._id === user._id);
          if (!exists) {
            return [user,...prevArray];
          }
          return prevArray;
        });
        const chatId = displayChat?._id
        const userId = user._id
        console.log(chatId, userId)
        try {
            dispatch(adduserToGrp({chatId, userId}))
            socket.emit('added to group', userId)
            toast.success("user added to this conversation")
        } catch (error) {
            
        }
      }
      
      

      //from the state variable and then call action to remove from db
      function removeAddedUser(userId){
        const newArray = usersArrayToSend.filter((u)=> u._id !== userId)
        setUsersArrayToSend(newArray)
        const chatId = displayChat?._id
        handleRemoveUser({chatId, userId, boolVal: false})
        socket.emit("leave group", usersArrayToSend)
      }

      //from db using dispatch an action
    function handleRemoveUser({chatId, userId, boolVal}){   //if boolVal true => user left chat false=> user being removed
        try {
            console.log()
            dispatch(removeFromGrpChat({chatId, userId, boolVal}))
            if(userId === loggedInUserId && !error && boolVal){
                toast.success('You left this conversation')
                dispatch(fetchAllChatsFromBknd())
            }else if(userId !== loggedInUserId && !error  && !boolVal){
                toast.success('Participant removed from this conversation')
                socket.emit("leave group", usersArrayToSend)
            }
            // handleClose();
        } catch (error) {
            console.log(error)
        }
    }

    //updating grp name
    function upadteGroupName({chatId, newGroupName}){
        console.log(chatId , newGroupName)
        dispatch(updateGrpName({chatId , newGroupName}))
        dispatch(fetchAllChatsFromBknd())
        socket.emit("update group", usersArrayToSend)
        handleClose()
    }

  return (
    <div>
      <Button className='text-white text-xs' onClick={handleOpen}>{text}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           {displayChat?.chatName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} className='flex'>
            <input disabled ={loggedInUserId !== grpAdminId} type="text" className={`w-full p-2 border outline-none rounded-lg ${loggedInUserId === grpAdminId ? '' : 'disabledopacity-50 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'}`} placeholder='Group name' value={grpName} onChange={(e)=>setGrpName(e.target.value)}/>

            <button disabled ={loggedInUserId !== grpAdminId} className={`bg-[#3EA3A1] text-white p-2 rounded-lg ms-2 ${loggedInUserId === grpAdminId ? 'cursor-pointer' : 'disabledopacity-50 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'}`} onClick={()=> upadteGroupName({chatId : displayChat._id, newGroupName : grpName})}>Update</button>
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <input disabled ={loggedInUserId !== grpAdminId} type="text" className={`w-full p-2 border outline-none rounded-lg ${loggedInUserId === grpAdminId ? '' : 'disabledopacity-50 cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed'}`} placeholder='Search users' value={searchUserIp} onChange={(e)=>inputChangeHandler(e.target.value)}/>
          </Typography>


        {/* users to be added in grp list */}
          <div id="modal-modal-description" sx={{ mt: 2 }}>
                <div className='flex gap-2 p-1 overflow-x-scroll my-2'>
                    {usersArrayToSend.length > 0 ? usersArrayToSend.map((user)=>{
                        return <div key={user?._id} className='bg-[#ab8ce7] text-white text-xs font-semibold p-2 rounded-lg flex items-center'>
                            {loggedInUserId === user?._id ? "You" : user?.name}
                            {user?._id === grpAdminId ? <span className='ms-1'><b>(admin)</b></span> : null}

                            {loggedInUserId !== grpAdminId || loggedInUserId === user._id ? "" : <div className='w-5 h-5 rounded-full flex justify-center items-center ms-1 pe-2' onClick={()=> removeAddedUser(user?._id)}>
                                <i className="fa-solid fa-xmark ms-2 hover:text-red-600 cursor-pointer text-xs"></i>
                            </div>}
                        </div>
                    }) : ''}
                </div>
          </div>


        {/* fetched users list */}
          <div id="modal-modal-description" sx={{ mt: 2 }}>

            {loadingSearch && <div className='w-fit p-2 mx-auto'>
                        <ClipLoader color={[`#40BAB6`]} size={'25px'}/>
                        </div>}

                {fetchedUserFromQuery.length > 0 && <div>
                    {fetchedUserFromQuery.length > 0 ? fetchedUserFromQuery.map((user)=>{
                        return <div className='flex flex-row bg-gray-100 mb-1 p-2 rounded-lg hover:text-white hover:bg-[#40BAB6] cursor-pointer items-center gap-2' key={user?._id} onClick={()=> userClickHandler(user)}>
                            <div className='w-10 h-10 rounded-full'>
                                <img src={user?.picture}  className='w-10 h-10 rounded-full'/>
                            </div>
                            <div className='flex flex-col'>
                                <span>{user?.name}</span>
                                <span className='text-xs mt-1'><b>email :</b> {user?.email}</span>
                            </div>
                        </div>
                    }) : null}
                </div>}

                
          </div>


          <button className='bg-red-600 p-2 rounded-lg text-white outline-none cursor-pointer' onClick={()=>handleRemoveUser({chatId : displayChat?._id, userId : loggedInUserId, boolVal : true})}>Leave group</button>

        </Box>
      </Modal>
    </div>
  );
}