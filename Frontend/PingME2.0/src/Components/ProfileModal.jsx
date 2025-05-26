import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonMUI from '@mui/material/Button'; // <-- Renamed to avoid conflict
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

export default function ProfileModal({user, text}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if(!user) return

  return (
    <div>
      <ButtonMUI onClick={handleOpen}><span className='text-black'>{text}</span></ButtonMUI>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            <span className='text-4xl font-semibold text-center mb-4'>{user?.currentUser?.name || user[0]?.name}</span>
          </Typography>

          <Typography variant="h6" component="h2" className='flex justify-center'>
            <img src={user?.currentUser?.picture || user[0]?.picture} className='h-30 w-30 rounded-full mb-4'/>
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <span className='text-xl text-center mb-4'> email : {user?.currentUser?.email || user[0]?.email}</span>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
