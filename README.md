# EdTech-Assignment-Tracker

A simple web-based assignment management system built with React and Flask.  
This project lets teachers create assignments and students submit their work online.

## Features

### For Teachers
- Authentication (login / sign-up) with JWT
- Create assignments (title, description, due date)
- View all student submissions in one place
- Clean dashboard to manage assignments

### For Students
- Authentication (login / sign-up) with JWT
- View every assignment with creator and due date
- Submit assignments before the due date
- Track submission status (Pending / Submitted)
- Dashboard showing all assigned work

## Technology Stack

### Front-end
- React 19.1.0
- React Router 7.7.0
- Tailwind CSS 4.1.11
- React Icons 5.5.0
- Axios 1.10.0
- Vite 7.0.4

### Back-end
- Flask
- SQLAlchemy
- PostgreSQL
- PyJWT
- Flask-CORS
- python-dotenv

## Prerequisites
- Node 14+
- Python 3.8+
- PostgreSQL
- Git

## Installation & Setup

### Back-end
1. Clone the repo  
   ```
   git clone 
   cd assignment-portal
   ```
2. Create and activate a virtual environment  
   ```
   python -m venv venv
   source venv/bin/activate       # Windows: venv\Scripts\activate
   ```
3. Install Python packages  
   ```
   pip install flask flask-sqlalchemy flask-cors psycopg2-binary pyjwt python-dotenv
   ```
4. Configure the database  
   ```
   createdb assignment_portal_db   # PostgreSQL
   ```
   Create `.env` inside `backend/app/`  
   ```
   DATABASE_URL=postgresql://:@localhost/assignment_portal_db
   SECRET_KEY=your-secret-key
   ```
5. Run the Flask server  
   ```
   python run.py      # http://127.0.0.1:5000
   ```

### Front-end
1. Open a new terminal  
   ```
   cd frontend
   ```
2. Install packages  
   ```
   npm install
   ```
3. Start Vite dev server  
   ```
   npm run dev        # http://localhost:5173
   ```

## Usage

1. Navigate to `http://localhost:5173`
2. Click **Login** and choose **Teacher** or **Student**
3. Sign up or log in

### Teacher Flow
1. After login, click **Create Assignment**
2. Fill title, description, due date, then submit
3. Click **View Submissions** to see student work

### Student Flow
1. Dashboard shows all assignments
2. Click a pending assignment, write content, then submit
3. Status changes to **Submitted**

## Project Structure

```
assignment-portal/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── jwt_token_utils/
│   │       ├── student_auth_token.py
│   │       └── teacher_auth_token.py
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── Authentication/
│   │   │   ├── teacherLogin.jsx
│   │   │   ├── teacherSignUp.jsx
│   │   │   ├── studentLogin.jsx
│   │   │   └── studentSignUp.jsx
│   │   ├── teacher/
│   │   │   ├── teacherHomePage.jsx
│   │   │   ├── teacherAPI.jsx
│   │   │   └── taskForm.jsx
│   │   ├── student/
│   │   │   ├── studentHomePage.jsx
│   │   │   ├── studentAPI.jsx
│   │   │   └── studentSubmission.jsx
│   │   ├── ProtectedStudentRoute.jsx
│   │   ├── ProtectedTeacherRoute.jsx
│   │   ├── studentAuthContext.jsx
│   │   ├── teacherAuthContext.js
│   │   ├── homePage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
└── README.md
```

## Database Design

**Tables**

| Table        | Fields                                                                 |
|--------------|------------------------------------------------------------------------|
| teachers     | id, name, email, password, role, created_at                            |
| students     | id, name, email, password, role, created_at                            |
| assignments  | id, title, description, due_date, teacher_id, created_at               |
| submissions  | id, content, submitted_at, student_id, assignment_id                   |

## Security

- JWT authentication for teachers and students  
- Role-based protected routes  
- Auto-logout on token expiry  
- Server-side & client-side validation  
- CORS enabled for safe API calls  

## API Overview

Authentication  
*POST* `/teacher/signUp`  
*POST* `/teacher/login`  
*POST* `/student/signUp`  
*POST* `/student/login`

Assignments  
*POST* `/teacher/assignment`  
*GET* `/student/assignments`

Submissions  
*POST* `/student/submission`  
*GET* `/student/submission`

## Challenges Faced

- Implementing JWT and protected routes  
- Handling role separation so pages are secure  
- Making React context manage tokens and expiry  
- Linking React and Flask smoothly  

## Lessons Learned

- Full-stack basics: front-end, back-end, database  
- React hooks and context  
- Flask with SQLAlchemy and JWT  
- Tailwind for quick responsive UI  
- Project organization and Git workflow  

## Future Work

- File upload support  
- Email notifications  
- Grade/marks management  
- Password reset and email verification  
- Mobile-friendly redesign  

## Known Issues

- Tokens expire but do not refresh (auto-logout only)  
- Only plain-text submissions (no file uploads)  
- No email verification or password reset yet  

## Author

Gona Damodhar Reddy  
Email: gonadamodharreddy999@gmail.com  
GitHub: [DamodharGona](https://github.com/DamodharGona)  
Date: 23/07/2025

This is my first full-stack project built for learning purposes. Thank you for checking it out!
