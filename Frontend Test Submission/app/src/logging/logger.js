const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrc2hpdGlqLm1vZ2hlXzIwMjZAd294c2VuLmVkdS5pbiIsImV4cCI6MTc1NDg5MDIxNywiaWF0IjoxNzU0ODg5MzE3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjQwNzAyODMtNzJjNy00NDYwLThjM2MtNDkxZjFkNmIxNWQ5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia3NoaXRpaiBtb2doZSIsInN1YiI6IjNiYzA2ZmQ0LTc3ZGQtNDM4Ni05MThmLThjNjI5MjVlOThjZiJ9LCJlbWFpbCI6ImtzaGl0aWoubW9naGVfMjAyNkB3b3hzZW4uZWR1LmluIiwibmFtZSI6ImtzaGl0aWogbW9naGUiLCJyb2xsTm8iOiIyMnd1MDEwMTEzMiIsImFjY2Vzc0NvZGUiOiJVTVhWUVQiLCJjbGllbnRJRCI6IjNiYzA2ZmQ0LTc3ZGQtNDM4Ni05MThmLThjNjI5MjVlOThjZiIsImNsaWVudFNlY3JldCI6ImpuQll5c1RZd05xY1ZFeFcifQ.mZhbUF6puhxxmADOHr1pCDjmwJB43FwnV598ac8qbbI";

export const useLogger = () => {
  const log = async (level, pkg, message) => {
    try {
      await fetch(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stack: 'frontend',
          level: level,
          package: pkg,
          message: message,
        }),
      });
      console.log(`frontend log: [${level.toUpperCase()}] ${message}`);
    } catch (error) {
      console.error('error sending frontend log:', error);
    }
  };

  return { log };
};