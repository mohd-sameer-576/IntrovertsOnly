import io from 'socket.io-client'

let socket = null

export const initSocket = (userId) => {
  if(!socket) {
    // Use the same origin in production, localhost in development
    const socketURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : window.location.origin
    
    socket = io(socketURL, {
      auth: {
        userId
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    })
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if(socket) {
    socket.disconnect()
    socket = null
  }
}
