import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false, // connect manually after login
});

export default socket;