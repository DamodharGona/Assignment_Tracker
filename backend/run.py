from app import create_app
from app.models import db, Teacher, Student, Assignment, Submission

app = create_app()

with app.app_context():
    try:
        db.create_all()
        print("Tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == '__main__':
    app.run(debug=True)