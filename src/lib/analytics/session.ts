const SESSION_KEY = 'portfolix_session_id';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export function getOrCreateSessionId(): string {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    
    if (sessionData) {
      const { sessionId, timestamp } = JSON.parse(sessionData);
      const now = Date.now();
      
      if (now - timestamp < SESSION_DURATION) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ sessionId, timestamp: now }));
        return sessionId;
      }
    }
  } catch {
    // Ignore parse errors
  }
  
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    sessionId: newSessionId,
    timestamp: Date.now()
  }));
  
  return newSessionId;
}
