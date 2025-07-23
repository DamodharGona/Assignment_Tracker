import jwt
import datetime


SECRET_KEY = "teacher-secret-key"

def generate_teacher_token(id,role):
    payload = {
        "teacher_id": id,
       "user_role": role,
       "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def decode_teacher_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded  # This will be a dictionary with your payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
