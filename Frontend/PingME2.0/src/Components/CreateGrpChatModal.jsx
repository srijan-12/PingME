import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios, { all } from 'axios';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createGrpChat, settingError } from '../redux/slices/chatSlice';
import { ClipLoader } from 'react-spinners';
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

export default function CreateGrpChatModal({text}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const[grpName, setGrpName] = React.useState('');
  const[searchUserIp, setSearchUserIp] = React.useState('')
  const[usersToAddArray, setUsersToAddArray] = React.useState([])
  const[loadingSearch, setLoadingSearch] = React.useState(false)

  const[usersArrayToSend, setUsersArrayToSend] = React.useState([])

  const {allChat, error, loading, displayChat} = useSelector(state => state.chat)
  

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
                setUsersToAddArray([])
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
                    setUsersToAddArray(result?.data?.result)
                    setLoadingSearch(false)
                    return
                },300)
            } catch (error) {
                console.log(error.message);
            }
        },300)
    },[baseURL])

    React.useEffect(()=>{
        return ()=>debouncedSearch.cancel()
    },[debouncedSearch])


    function inputChangeHandler(value){
        setSearchUserIp(value);
        debouncedSearch(value)
    }

    function userClickHandler(user) {
        setUsersArrayToSend(prevArray => {
          const exists = prevArray.some(u => u._id === user._id);
          if (!exists) {
            return [user,...prevArray];
          }
          return prevArray;
        });
      }      

      function removeAddedUser(userId){
        const newArray = usersArrayToSend.filter((u)=> u._id !== userId)
        console.log(newArray)
        setUsersArrayToSend(newArray)
      }

    async function handleCreateGroup(){
        try {
            dispatch(createGrpChat({grpName, usersArrayToSend}))
           const usersArrayToSendOnlyId = usersArrayToSend.map((u) => u._id);
           socket.emit('Group created', usersArrayToSendOnlyId)
            handleClose();
        } catch (error) {
            console.log(error)
        }
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
            Create Group chat 
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <input type="text" className='w-full p-2 border outline-none rounded-lg' placeholder='Group name' value={grpName} onChange={(e)=>setGrpName(e.target.value)}/>
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <input type="text" className='w-full p-2 border outline-none rounded-lg' placeholder='Search users' value={searchUserIp} onChange={(e)=>inputChangeHandler(e.target.value)}/>
          </Typography>


        {/* users to be added in grp list */}
          <div id="modal-modal-description" sx={{ mt: 2 }}>
                <div className='flex gap-2 p-1 overflow-x-scroll'>
                    {usersArrayToSend.length > 0 ? usersArrayToSend.map((user)=>{
                        return <div key={user?._id} className='bg-[#ab8ce7] text-white text-xs font-semibold p-2 rounded-lg flex items-center'>
                            {user?.name}

                            <div className='w-5 h-5 rounded-full flex justify-center items-center ms-1 pe-2' onClick={()=> removeAddedUser(user?._id)}>
                                <i className="fa-solid fa-xmark ms-2 hover:text-red-600 cursor-pointer text-xs"></i>
                            </div>
                        </div>
                    }) : ''}
                </div>
          </div>


        {/* found users list */}
          <div id="modal-modal-description" sx={{ mt: 2 }}>

            {loadingSearch && <div className='w-fit p-2 mx-auto'>
                        <ClipLoader color={[`#40BAB6`]} size={'25px'}/>
                        </div>}

                {usersToAddArray.length > 0 && <div>
                    {usersToAddArray.length > 0 ? usersToAddArray.map((user)=>{
                        return <div className='flex flex-row bg-gray-100 mb-1 p-2 rounded-lg hover:text-white hover:bg-[#40BAB6] cursor-pointer items-center gap-2' key={user?._id} onClick={()=> userClickHandler(user)}>
                            <div className='w-10 h-10 rounded-full'>
                                <img src={user?.picture} className='w-10 h-10 rounded-full'/>
                            </div>
                            <div className='flex flex-col'>
                                <span>{user?.name}</span>
                                <span className='text-xs mt-1'><b>email :</b> {user?.email}</span>
                            </div>
                        </div>
                    }) : null}
                </div>}

                
          </div>


          <button className='bg-[#3483C1] p-2 rounded-lg text-white outline-none cursor-pointer' onClick={()=>handleCreateGroup()}>Create</button>

        </Box>
      </Modal>
    </div>
  );
}