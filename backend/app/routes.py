import datetime

from flask import Blueprint, request, jsonify
from .models import Teacher, Student, Assignment, Submission, db
import traceback
from .jwt_token_utils.teacher_auth_token import generate_teacher_token
from .jwt_token_utils.teacher_auth_token import decode_teacher_token
from .jwt_token_utils.student_auth_token import generate_student_token
from .jwt_token_utils.student_auth_token import decode_student_token

main = Blueprint('main', __name__)

@main.route('/teacher/signUp', methods=['POST'])
def teacher_signUp():
    try:
        print("adding new teacher")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"name: {data['name']}")
        print(f"email: {data['email']}")
        print(f"password: {data['password']}")
        print(f"role: {data['role']}")

        #check if the teacher already exist
        existing_teacher = Teacher.query.filter_by(email=data['email']).first()
        if existing_teacher:
            return jsonify({'message': f'Teacher already exists.'}), 409

        # Create new teacher
        print("Creating Teacher object...")
        new_teacher = Teacher(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data['role']
        )
        print("Teacher object created successfully")

        # Add to database
        print("Adding to database session...")
        db.session.add(new_teacher)

        print("Committing to database...")
        db.session.commit()

        auth_token = generate_student_token(new_teacher.id, data['role'])
        print(f"Generated token for new student: {auth_token}")

        print("SUCCESS: Teacher created")
        return jsonify({
            'message': 'Teacher created successfully',
            'token': auth_token,
            'teacher': {
                'id': new_teacher.id,
                'name': new_teacher.name,
                'email': new_teacher.email
            }
        }), 201

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@main.route('/student/signUp', methods=['POST'])
def student_signUp():
    try:
        print("adding new student")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"name: {data['name']}")
        print(f"email: {data['email']}")
        print(f"password: {data['password']}")
        print(f"role: {data['role']}")

        #check if the student already exist
        existing_student = Student.query.filter_by(email=data['email']).first()
        if existing_student:
            return jsonify({'message': f' student already exists.'}), 409

        # Create new student
        print("Creating Student object...")
        new_student = Student(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data['role']
        )
        print("Student object created successfully")

        # Add to database
        print("Adding to database session...")
        db.session.add(new_student)

        print("Committing to database...")
        db.session.commit()

        auth_token = generate_student_token(new_student.id, data['role'])
        print(f"Generated token for new student: {auth_token}")

        print("SUCCESS: Student created")
        return jsonify({
            'message': 'Student created successfully',
            'token': auth_token,
            'student': {
                'id': new_student.id,
                'name': new_student.name,
                'email': new_student.email
            }
        }), 201

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@main.route('/student/login', methods=['POST'])
def student_login():
    try:
        print("adding new student")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"email: {data['email']}")
        print(f"password: {data['password']}")
        print(f"role: {data['role']}")

        #check if the student already exist
        existing_student = Student.query.filter_by(email=data['email']).first()
        if existing_student is None:
            return jsonify({'message': f' student does not exists.'}), 404
        if existing_student.password != data['password'] :
            return jsonify({'message': f'password entered does not match'}), 404

        auth_token = generate_student_token(existing_student.id, data['role'])
        print("auth token is generated,", auth_token)
        if auth_token:
            return jsonify({'token': auth_token, 'message': 'student logged successfully', 'student': {
                "id": existing_student.id,
                "name": existing_student.name,
                "email": existing_student.email
            }})
        return jsonify({'message': f' failed to create auth_token '})

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



@main.route('/teacher/login', methods=['POST'])
def teacher_login():
    try:
        print("adding new teacher")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"email: {data['email']}")
        print(f"password: {data['password']}")
        print(f"role: {data['role']}")

        #check if the teacher already exist
        existing_teacher = Teacher.query.filter_by(email=data['email']).first()
        if existing_teacher is None:
            return jsonify({'message': f' teacher does not exists.'}), 404
        if existing_teacher.password != data['password'] :
            return jsonify({'message': f'password entered does not match'})

        auth_token = generate_teacher_token(existing_teacher.id, data['role'])
        print("auth token is generated,", auth_token)
        if auth_token:
            return jsonify({'token': auth_token, 'teacher': {
                "id": existing_teacher.id,
                "email": existing_teacher.email,
                "name": existing_teacher.name
            }, 'message': 'teacher successfully logged in'})
        return jsonify({'message': f' failed to create auth_token '})

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@main.route('/teacher/assignment', methods=['POST'])
def add_assignment():
    try:
        print("adding new assignment")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['title', 'description', 'dueDate']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"title: {data['title']}")
        print(f"description: {data['description']}")
        print(f"dueDate: {data['dueDate']}")

        #check if the assignment already exist
        existing_assignment = Assignment.query.filter_by(title=data['title']).first()
        if existing_assignment:
            return jsonify({'message': f' assignment already exists.'}), 404

        due_date = datetime.datetime.fromisoformat(data['dueDate'])

        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        payload = decode_teacher_token(token)
        teacher_id = payload.get('teacher_id')
        print("teacher id is: ",teacher_id)

        print("creating a new assignment")
        new_assignment = Assignment(
            title=data['title'],
            description=data['description'],
            due_date=due_date,
            teacher_id=teacher_id
        )

        print("assignment object created successfully")

        # Add to database
        print("Adding to database session...")
        db.session.add(new_assignment)

        print("Committing to database...")
        db.session.commit()

        print("SUCCESS: assignment created")
        return jsonify({'message': 'assignment created successfully'}), 201

    except Exception as e:(
        print(f"ERROR: Exception occurred: {str(e)}"))
    print(f"ERROR: Traceback: {traceback.format_exc()}")
    db.session.rollback()
    return jsonify({'error': f'Internal server error: {str(e)}'}), 500



@main.route('/student/submission', methods=['POST'])
def add_submission():
    try:
        print("adding new submission")

        # Check if request has JSON data
        data = request.get_json()
        print(f"Received data: {data}")

        if not data:
            print("ERROR: No JSON data received")
            return jsonify({'error': 'No JSON data provided'}), 400


        # Validate required fields
        required_fields = ['content', 'submittedAt', 'assignment_id']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return jsonify({'error': f'Missing required field: {field}'}), 400

        print(f"content: {data['content']}")
        print(f"submittedAt: {data['submittedAt']}")
        print(f"assignment_id: {data['assignment_id']}")

        #check if the submission already exist
        existing_submission = Submission.query.filter_by(content=data['content']).first()
        if existing_submission:
            return jsonify({'message': f' submission already exists.'}), 404



        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        payload = decode_student_token(token)
        student_id = payload.get('student_id')
        print("student id is: ",student_id)
        submitted_at = datetime.datetime.fromtimestamp(data['submittedAt'] / 1000)
        print("creating a new submission")
        new_submission = Submission(
            content=data['content'],
            submitted_at=submitted_at,
            student_id=student_id,
            assignment_id=data['assignment_id']
        )

        print("assignment object created successfully")

        # Add to database
        print("Adding to database session...")
        db.session.add(new_submission)

        print("Committing to database...")
        db.session.commit()

        print("SUCCESS: assignment created")
        return jsonify({'message': 'assignment created successfully'}), 201

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
    print(f"ERROR: Traceback: {traceback.format_exc()}")
    db.session.rollback()
    return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@main.route('/student/submission', methods=['GET'])
def get_submissions():
    try:
        print("getting the submissions")

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        print("token is: ", token)
        payload = decode_teacher_token(token)
        print("payload is: ", payload)

        # Check if token decoding was successful
        if not payload.get("success", True):
            return jsonify({"message": payload.get("error", "Invalid token")}), 401

        teacher_id = payload.get('teacher_id')
        print("teacher id is: ", teacher_id)
        print(f"Teacher ID type: {type(teacher_id)}")

        if not teacher_id:
            return jsonify({"message": "Invalid token: missing teacher_id"}), 401

        # Get assignments for this teacher
        teacher_assignments = Assignment.query.filter_by(teacher_id=teacher_id).all()
        assignment_ids = [assignment.id for assignment in teacher_assignments]

        # Get submissions for teacher's assignments only
        submissions = Submission.query.filter(Submission.assignment_id.in_(assignment_ids)).all()

        submission_list = []
        for submission in submissions:
            #  Get assignment and student details
            assignment = Assignment.query.get(submission.assignment_id)
            student = Student.query.get(submission.student_id)

            submission_list.append({
                "id": submission.id,
                "content": submission.content,
                "submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None,
                "assignment_name": assignment.title if assignment else "Unknown Assignment",
                "student_name": student.name if student else "Unknown Student"
            })

        print("SUCCESS: Submissions fetched")
        return jsonify({
            'message': 'submissions fetched successfully',
            'submissions': submission_list
        }), 200

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



@main.route('/teacher/assignments', methods=['GET'])
def get_assignments():
    try:
        print("getting the assignments")
        assignments = Assignment.query.all()
        assignment_list = [{
            "id": assignment.id,
            "title": assignment.title,
            "description": assignment.description,
            "due_date": assignment.due_date,
            "teacher_id": assignment.teacher_id
        } for assignment in assignments]

        print("SUCCESS: assignments fetched")
        return jsonify({'message': 'assignments fetched successfully', 'assignments': assignment_list}), 200

    except Exception as e:(
        print(f"ERROR: Exception occurred: {str(e)}"))
    print(f"ERROR: Traceback: {traceback.format_exc()}")
    db.session.rollback()
    return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@main.route('/student/assignments', methods=['GET'])
def show_assignments():
    try:
        print("getting the assignments needed to display")
        assignments = Assignment.query.all()
        print(f"Found {len(assignments)} assignments")

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        print("token is: ", token)
        payload = decode_student_token(token)
        print("payload is: ", payload)

        student_id = payload.get('student_id')
        print("student id is: ", student_id)
        print(f"Student ID type: {type(student_id)}")

        display_list = []
        for assignment in assignments:
            print(f"\n--- Processing Assignment {assignment.id} ---")
            print(f"Assignment title: {assignment.title}")

            # Debug the submission query
            submission_query = Submission.query.filter_by(
                student_id=student_id,
                assignment_id=assignment.id
            )
            print(f"Query: student_id={student_id}, assignment_id={assignment.id}")

            submission = submission_query.first()
            print(f"Submission found: {submission}")

            if submission:
                print(f"Submission details: id={submission.id}, content='{submission.content}', student_id={submission.student_id}, assignment_id={submission.assignment_id}")

            submitted = submission is not None
            print(f"Final submitted status: {submitted}")

            teacher = Teacher.query.filter_by(id=assignment.teacher_id).first()
            teacher_name = teacher.name if teacher else "Unknown Teacher"

            display_list.append({
                "id": assignment.id,
                "title": assignment.title,
                "description": assignment.description,
                "due_date": assignment.due_date.isoformat(),
                "submitted": submitted,
                "created_by": teacher_name
            })

        print(f"\n--- Final display_list ---")
        print(display_list)

        return jsonify({
            'message': 'assignments fetched successfully',
            'assignments': display_list
        }), 200

    except Exception as e:
        print(f"ERROR: Exception occurred: {str(e)}")
        import traceback
        print(f"ERROR: Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
