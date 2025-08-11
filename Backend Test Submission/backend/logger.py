import requests
import json


LOG_API_URL = "http://20.244.56.144/evaluation-service/logs"

AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrc2hpdGlqLm1vZ2hlXzIwMjZAd294c2VuLmVkdS5pbiIsImV4cCI6MTc1NDg5NTYxNCwiaWF0IjoxNzU0ODk0NzE0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWYyOTg4NWMtNjQ4MC00ODM2LWExNzktMTIyOGRhODEyYjFjIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoia3NoaXRpaiBtb2doZSIsInN1YiI6IjNiYzA2ZmQ0LTc3ZGQtNDM4Ni05MThmLThjNjI5MjVlOThjZiJ9LCJlbWFpbCI6ImtzaGl0aWoubW9naGVfMjAyNkB3b3hzZW4uZWR1LmluIiwibmFtZSI6ImtzaGl0aWogbW9naGUiLCJyb2xsTm8iOiIyMnd1MDEwMTEzMiIsImFjY2Vzc0NvZGUiOiJVTVhWUVQiLCJjbGllbnRJRCI6IjNiYzA2ZmQ0LTc3ZGQtNDM4Ni05MThmLThjNjI5MjVlOThjZiIsImNsaWVudFNlY3JldCI6ImpuQll5c1RZd05xY1ZFeFcifQ.d7zqkpSN3e8HReFtUu8TNfvvRe7ip2j1DI3N1edIgYs"

def Log(level: str, package: str, message: str):
    """
    so these are the args and all are strings :
        level: The severity of the log (eg: "info", "error")
        package: The backend module where the log originates (eg: "handler","db")
        message: The descriptive log message
    """
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "stack": "backend", 
        "level": level,
        "package": package,
        "message": message
    }
    
    try:
        response = requests.post(LOG_API_URL, headers=headers, data=json.dumps(payload))
        
        if 200 <= response.status_code < 300:
            print(f"sending backend logs: [{level.upper()}] {message}")
        else:
            print(f"error sending the logs status: {response.status_code}, Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")