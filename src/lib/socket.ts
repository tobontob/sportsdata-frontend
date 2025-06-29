import { io, Socket } from 'socket.io-client'

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

// 연결 상태 모니터링
socket.on('connect', () => {
  console.log('Socket.IO 연결됨:', socket.id)
})

socket.on('disconnect', (reason: string) => {
  console.log('Socket.IO 연결 해제:', reason)
})

socket.on('connect_error', (error: Error) => {
  console.error('Socket.IO 연결 오류:', error)
})

export default socket 