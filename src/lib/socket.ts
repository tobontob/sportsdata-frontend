import io from 'socket.io-client'

let socket: ReturnType<typeof io> | null = null;

// 브라우저 환경에서만 socket 인스턴스 생성
if (typeof window !== 'undefined') {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  // 디버깅용: window에서 직접 접근 가능
  (window as any).socket = socket;
  
  // 연결 상태 모니터링
  socket.on('connect', () => {
    console.log('Socket.IO 연결됨:', socket?.id)
  })
  socket.on('disconnect', (reason: string) => {
    console.log('Socket.IO 연결 해제:', reason)
  })
  socket.on('connect_error', (error: Error) => {
    console.error('Socket.IO 연결 오류:', error)
  })
}

// 타입 안전성을 위해 non-null assertion 사용
export default socket!; 