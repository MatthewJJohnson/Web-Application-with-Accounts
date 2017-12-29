from flask import Flask, jsonify, request
from flask import Flask, flash, redirect, render_template, request, session, abort
from werkzeug.security import generate_password_hash, check_password_hash
import flask_sqlalchemy as sqlalchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from marshmallow import Schema, fields
from marshmallow_sqlalchemy import ModelSchema
from sqlalchemy import Table, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
import hashlib
import os
import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'

app.secret_key = 'a secret key'

db = sqlalchemy.SQLAlchemy(app)

#must be declared first

class LoggedIn(db.Model):
    __tablename__ = 'LoggedIn'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=False)#remember to delete all in case multiple logins

class Student(db.Model):
    __tablename__ = 'Student'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(64), unique=False)
    lastname = db.Column(db.String(64), unique=False)
    username = db.Column(db.String(64), unique=True)
    password_hash = db.Column(db.String(1000), unique=False)
    major = db.Column(db.String(64))
    graduation_date = db.Column(db.String(64))
    wsu_id = db.Column(db.String(8), unique=True)
    phone_num = db.Column(db.String(10))
    gpa = db.Column(db.Float)
    previous_ta = db.Column(db.String(3)) #at most 'yes'
    #applied = db.relationship('Instructor', secondary=Students_in_Course, backref= 'Course')

    def set_password(self, password):
        return generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    def is_authenticated(self):
        return True #will authenticate if username and password are valid and correct

    def __init__(self, firstname="", lastname="", username="", password="", major="", graduation_date="", wsu_id="", gpa = 0.0, phone_num="", previous_ta=""):
        self.major = major
        self.graduation_date = graduation_date
        self.wsu_id = wsu_id
        self.gpa = gpa
        self.phone_num = phone_num
        self.previous_ta = previous_ta
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password_hash = self.set_password(password)

# class StudentSchema(ModelSchema):
#     class Meta:
#         fields = ('firstname', 'lastname', 'username')


class Instructor(db.Model):
    __tablename__ = 'Instructor'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(64), unique=False)
    lastname = db.Column(db.String(64), unique=False)
    username = db.Column(db.String(64), unique=True)
    password_hash = db.Column(db.String(1000), unique=False)
    wsu_id = db.Column(db.String(8), unique=True)
    phone_num = db.Column(db.String(10))
    #course = db.relationship('Student', secondary=Students_in_Course, backref= 'applied')

    def set_password(self, password):
        return generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_authenticated(self):
        return True #will authenticate if username and password are valid and correct

    def __init__(self, firstname="", lastname="", username="", password="", wsu_id="", phone_num=""):
        self.wsu_id = wsu_id
        self.phone_num = phone_num
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password_hash = self.set_password(password)

class CourseApplication(db.Model):
    __tablename__ = 'StudentApplications'
    id = db.Column(db.Integer, primary_key = True)
    coursename =  db.Column(db.String(64), unique=False)
    student = db.Column(db.String(64))#John SMith
    gradeReceived = db.Column(db.String(2))
    semesterTook = db.Column(db.String(64))
    semesterApplying = db.Column(db.String(64))
    previousTA = db.Column(db.String(64))

class Course(db.Model):
   __tablename__ = 'Courses'
   id = db.Column(db.Integer, primary_key=True)
   #instructor = db.Column(db.String(64), db.ForeignKey('Instructor.username'))#holds ID of instructor teaching this course
   instructor = db.Column(db.String(64))#will actually be semester teaching
   coursename = db.Column(db.String(64), unique = True)#will be coursename
   labcount = db.Column(db.Integer)#will be labcount
   lecturecount = db.Column(db.Integer)#will be lecture count
   semesterteaching = db.Column(db.String(64))
   TA = db.Column(db.String(64))#holds a ELEMENT ID

def student_to_obj(row):
   row = {
           "id": row.id,
           "firstname": row.firstname,
           "lastname": row.lastname,
           "username": row.username,
           "password_hash": row.password_hash,
           "major": row.major,
           "graduation_date": row.graduation_date,
           "wsu_id": row.wsu_id,
           "phone_num": row.phone_num,
           "gpa": row.gpa,
           "previous_ta": row.previous_ta
       }
   return row

def instructor_to_obj(row):
    row = {
            "id": row.id,
            "firstname": row.firstname,
            "lastname": row.lastname,
            "username": row.username,
            "password_hash": row.password_hash,
            "wsu_id": row.wsu_id,
            "phone_num": row.phone_num
            #"courses": row.courses
        }
    return row

def application_to_obj(row):
    row = {
            "id": row.id,
            "coursename": row.coursename,
            "gradeReceived": row.gradeReceived,
            "semesterTook": row.semesterTook,
            "semesterApplying": row.semesterApplying,
            "previousTA": row.previousTA,
            "student": row.student
        }
    return row

def appliedlist_to_obj(row):
    row = {
            "course": row.coursename
        }
    return row

def course_to_obj(row):
   row = {
           "id": row.id,
           "coursename": row.coursename,
           "instrutor": row.instructor,
           "labcount": row.labcount,
           "lectureCount": row.lecturecount,
           "semesterOffered": row.semesterteaching,
           "TA": row.TA
   }
   return row

#dem Routes doe
#we do nothing until somebody logs in
#@app.route("/")
#def page():
#    return send_from_directory('static', 'home.html')

@app.route('/api/student_signup', methods=['POST'])
def createStudent():
    newStudent = Student(**request.json)
    db.session.add(newStudent)
    db.session.commit()
    db.session.refresh(newStudent)
    return jsonify({"status":1, "student": student_to_obj(newStudent)}),200

@app.route('/api/instructor_signup', methods=['POST'])
def createInstructor():
    newInstructor = Instructor(**request.json)
    db.session.add(newInstructor)
    db.session.commit()
    db.session.refresh(newInstructor)
    return jsonify({"status":1, "instructor": instructor_to_obj(newInstructor)}),200

@app.route('/api/logout/<string:Ausername>', methods=['GET'])
def logout(Ausername):
    while (db.session.query(LoggedIn).filter_by(username=Ausername).first() != None):
        db.session.query(LoggedIn).filter_by(username=Ausername).delete()
        db.session.commit()
    return jsonify({'result': 'logout successful'}), 200

@app.route('/api/student_login', methods=['POST'])
def studentLogin():
    body = request.json

    user = db.session.query(Student).filter_by(username=body['username']).first() #check username first
    #userschema = StudentSchema(many=False)#login serializatoin

    if user is None: #user not found in db
        return jsonify({'error': 'username or password incorrect'}), 500

    if user.check_password(body['password']): #if password is correct
        addToLog = LoggedIn()
        addToLog.username = body['username']
        db.session.add(addToLog)#put the username as currently logged in
        db.session.commit()
        db.session.refresh(addToLog)
        return jsonify({'status': 1, 'result': student_to_obj(user)})

    return jsonify({'error': 'username or password incorrect'}), 500

@app.route('/api/instructor_login', methods=['POST'])
def instructorLogin():
    body = request.json

    user = db.session.query(Instructor).filter_by(username=body['username']).first() #check username first
    #userschema = UserSchema(many=False)#login serializatoin

    if user is None: #user not found in db
        return jsonify({'error': 'username or password incorrect'}), 500

    if user.check_password(body['password']):#if password is correct
        addToLog = LoggedIn()
        addToLog.username = body['username']
        db.session.add(addToLog)#put the username as currently logged in
        db.session.commit()
        db.session.refresh(addToLog)
        return jsonify({'status': 1, 'result': instructor_to_obj(user)}), 200

    return jsonify({'error': 'username or password incorrect'}), 500

#show a students data members based off their username
@app.route('/api/student_page/<string:Susername>', methods=['GET'])
def studentPage(Susername):
    found = db.session.query(LoggedIn).filter_by(username=Susername).first()
    if found.username == Susername:
        student = Student.query.filter_by(username=Susername).first()
        return jsonify({"status": 1, "student": student_to_obj(student)}), 200
    else:
        return jsonify({"status": 0, "student": {}})#not logged in because not found in the db

#show a instructor data member based off their id
@app.route('/api/instructor_page/<string:Iusername>', methods=['GET'])
def instructorPage(Iusername):
    found = db.session.query(LoggedIn).filter_by(username=Iusername).first()
    if found.username == Iusername:
        instructor = Instructor.query.filter_by(username=Iusername).first()
        return jsonify({"status": 1, "instructor": instructor_to_obj(instructor), "status": 1}), 200
    else:
        return jsonify({"status": 0, "student": {}})

@app.route('/api/update_student/<string:username>', methods=['POST'])
def updateStudent(username):
    account = Student.query.filter_by(username=username).first()
    update = request.json
    account.phone_num = update['Phone']
    account.graduation_date = update['Grad']
    account.major = update['Major']
    account.gpa = update['GPA']
    account.previous_ta = update['TA']

    db.session.add(account)
    db.session.commit()
    db.session.refresh(account)
    return jsonify({"status":1, "student": student_to_obj(account)}),200

@app.route('/api/update_instructor/<string:username>', methods=['POST'])
def updateInstructor(username):
    account = Instructor.query.filter_by(username=username).first()
    update = request.json
    account.phone_num = update['Phone']

    db.session.add(account)
    db.session.commit()
    db.session.refresh(account)
    return jsonify({"status":1, "instructor": instructor_to_obj(account)}),200

@app.route('/api/new_ta_application', methods=['POST'])
def addApplication():
    newapplication = CourseApplication(**request.json)
    db.session.add(newapplication)
    db.session.commit()
    db.session.refresh(newapplication)
    return jsonify({"status":1, "application": application_to_obj(newapplication)}),200

#@app.route('/api/get_ta_applications/<string:username>', methods=['GET'])
#def getApplication(username):
#    application = CourseApplication.query.filter_by(student=username).limit(10)
#
#    return jsonify({"status":1, "application": application_to_obj(application[0])}),200

@app.route('/api/get_ta_applications/<string:username>', methods=['GET'])
def getApplication(username):
    query = CourseApplication.query.filter_by(student=username).limit(5)
    result = []
    for row in query:
        result.append(appliedlist_to_obj(row))
    return jsonify({"status":1, "applications": result}),200

@app.route('/api/ta_applications', methods=['GET'])
def showApps():
   query = CourseApplication.query.all()
   result = []
   for row in query:
       result.append(application_to_obj(row))
   return jsonify({"status": 1, "applications": result}), 200

@app.route('/api/course_ta_applications/<string:coursename>', methods=['GET'])
def getCourseApplications(coursename):
   query = CourseApplication.query.filter_by(coursename=coursename)
   result = []
   for row in query:
       result.append(application_to_obj(row))
   return jsonify({"status": 1, "applications": result}), 200


@app.route('/api/create_course', methods=['POST'])
def createCourse():
   newCourse = Course(**request.json)
   db.session.add(newCourse)
   db.session.commit()
   db.session.refresh(newCourse)
   return jsonify({"status": 1, "course": course_to_obj(newCourse)}), 200

@app.route('/api/courses', methods=['GET'])
def showCoures():
   query = Course.query.all()
   result = []
   for row in query:
       result.append(course_to_obj(row))
   return jsonify({"status": 1, "courses": result}), 200

@app.route('/api/get_courses/<string:username>/', methods=['GET'])
def getCourses(username):#displays courses taught on instructor page load
    query = Course.query.filter_by(instructor=username)
    result = []
    for row in query:
        result.append(course_to_obj(row))
    return jsonify({"status": 1, "courses": result}), 200

@app.route('/api/update_course/<string:ACoursename>/', methods=['POST'])
def updateCourse(ACoursename):
    course = Course.query.filter_by(coursename=ACoursename).first()
    if course is None:
        newCourse = Course(**request.json)
        db.session.add(newCourse)
        db.session.commit()
        db.session.refresh(newCourse)
        return jsonify({"status":1, "course": course_to_obj(newCourse)}),200
    else:
        update = request.json
        course.instructor = update['instructor']
        course.coursename = update['coursename']
        course.lecturecount = update['lecturecount']
        course.labcount = update['labcount']
        course.semesterteaching = update['semesterteaching']
        db.session.add(course)
        db.session.commit()
        db.session.refresh(course)
        return jsonify({"status":1, "course": course_to_obj(course)}),200

@app.route('/api/get_savedta/<string:course>/', methods=['GET'])
def showSaved(course):
    query = Course.query.filter_by(coursename=course).first()
    return jsonify({"status":1, "TA": query.TA})

@app.route('/api/save_ta/<string:course>/<string:boxID>/', methods=['POST'])
def saveTA(course, boxID):
    query = Course.query.filter_by(coursename=course).first()
    query.TA = boxID
    db.session.add(query)
    db.session.commit()
    db.session.refresh(query)
    return jsonify({"status":1, "course": course_to_obj(query)}), 200

@app.route('/api/show_applicants/<string:coursename>', methods=['GET'])
def showApplicants(coursename):
    query = CourseApplication.query.filter_by(coursename=coursename).all()
    applied = []
    for row in query:
        applied.append(application_to_obj(row))
    return jsonify({"status":1, "applicants":applied}), 200
# -------Use these functions to test the database-------
@app.route('/api/students')
def showStudents():
    query = Student.query.all()
    result = []
    for row in query:
        result.append(student_to_obj(row))
    return jsonify({"status": 1, "students": result}), 200

# Use this function to test the database
@app.route('/api/instructors')
def showInstructors():
    query = Instructor.query.all()
    result = []
    for row in query:
        result.append(instructor_to_obj(row))
    return jsonify({"status": 1, "instructors": result}), 200

# Testing
@app.route('/api/students', methods=['DELETE'])
def deleteStudents():
    db.session.query(Student).delete()
    db.session.commit()

    return jsonify({"status": 1}), 200

@app.route('/api/instructors', methods=['DELETE'])
def deleteInstructors():
    db.session.query(Instructor).delete()
    db.session.commit()

    return jsonify({"status": 1}), 200

@app.route('/api/courses', methods=['DELETE'])
def deleteCourses():
   db.session.query(Course).delete()
   db.session.commit()
   return jsonify({"status": 1}), 200

@app.route('/api/ta_applications', methods=['DELETE'])
def deleteApps():
   db.session.query(CourseApplication).delete()
   db.session.commit()
   return jsonify({"status": 1}), 200


def main():
    db.create_all() # creates the tables you've provided
    app.debug = True
    app.run()       # runs the Flask application

if __name__ == '__main__':
    main()
