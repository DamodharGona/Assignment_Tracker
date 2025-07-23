import jwt
import datetime

SECRET_KEY = "student-secret-key"

def generate_student_token(id,role):
    payload = {
    "student_id": id,
       "user_role": role,
       "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_student_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return {"success": False, "error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"success": False, "error": "Invalid token"}