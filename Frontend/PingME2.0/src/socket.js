import { io } from "socket.io-client";

const socket = io("https://pingme-backend-uhlp.onrender.com");

export default socket;
