from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuration settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mysecretpassword@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Employee model
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    employee_number = db.Column(db.String(20), nullable=False, unique=True)
    department = db.Column(db.String(100), nullable=False)
    employment_status = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    face_image = db.Column(db.Text, nullable=False)

# Create the database and table
with app.app_context():
    db.create_all()

# Route to render the record form
@app.route('/record-form')
def record_form():
    return render_template('record-form.html')

# Route to handle form submission
@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        # Get form data
        data = request.form
        
        # Create a new employee instance
        new_employee = Employee(
            first_name=data['firstName'],
            last_name=data['lastName'],
            employee_number=data['employeeNumber'],
            department=data['department'],
            employment_status=data['employmentStatus'],
            phone_number=data['phoneNumber'],
            email=data['email'],
            face_image=data['faceImage']
        )
        # Add new employee to the database session and commit changes
        db.session.add(new_employee)
        db.session.commit()
        return jsonify({'message': 'Employee data submitted successfully!'}), 201
    except Exception as e:
        # Rollback changes if an exception occurs and return error message
        db.session.rollback()
        return jsonify({'error': 'Failed to submit employee data', 'reason': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
