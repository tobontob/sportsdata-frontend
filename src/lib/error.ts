export function logError(error: Error, context?: string) {
  console.error(`[${context || 'Unknown'}]`, error)
  
  // 프로덕션 환경에서만 추가 로깅 서비스 사용
  if (process.env.NODE_ENV === 'production') {
    // Sentry 또는 다른 로깅 서비스로 전송
    // Sentry.captureException(error, { tags: { context } })
    
    // Vercel Analytics (선택사항)
    // analytics.track('error', { 
    //   message: error.message, 
    //   stack: error.stack,
    //   context 
    // })
  }
}

export function logInfo(message: string, data?: any) {
  console.log(`[INFO] ${message}`, data)
}

export function logWarning(message: string, data?: any) {
  console.warn(`[WARNING] ${message}`, data)
} 