import { io } from 'socket.io-client'

let socket = null
const baseURL = 'http://localhost:3000'
export const connectSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(baseURL, {
    auth: { token },
    withCredentials: true
  });

  socket.on('connect', () => {
    console.log('Connected to server')
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket