"""
    This file contains a small subset of the tests we will run on your backend submission
    """

import unittest
import os

import testLib


class TestStudents(testLib.StudentTestCase):

    ###
    # THESE ARE THE ACTUAL TESTS
    ###
    def testAdd1(self):
        """
            Test adding one student
            """
        respCreate = self.makeRequest("/api/student_signup", method="POST",
                                      data={'firstname': 'John',
                                            'lastname': 'Smith',
                                            'username': 'john.smith@wsu.edu',
                                            'password': 'password',
                                            'major': 'CptS',
                                            'graduation_date': 'Fall 2019',
                                            'wsu_id': '12345678',
                                            'phone_num': '9492224444',
                                            'gpa': '3.5',
                                            'previous_ta': 'no'
                                            })
        self.assertSuccessResponse(respCreate)
        self.assertEqual('john.smith@wsu.edu',
                         respCreate['student']['username'])

        # Now read the students
        respGet = self.getStudents()
        self.assertSuccessResponse(respGet)
        self.assertEqual(1, len(respGet['students']))
        self.assertEqual(respCreate['student']['id'], respGet['students'][0]['id'])


    def testLogin(self):

        # Add a student to the database
        respCreate = self.makeRequest("/api/student_signup", method="POST",
                                      data={'firstname': 'John',
                                            'lastname': 'Smith',
                                            'username': 'john.smith@wsu.edu',
                                            'password': 'password',
                                            'major': 'CptS',
                                            'graduation_date': 'Fall 2019',
                                            'wsu_id': '12345678',
                                            'phone_num': '9492224444',
                                            'gpa': '3.5',
                                            'previous_ta': 'no'
                                            })
        self.assertSuccessResponse(respCreate)
        self.assertEqual('12345678', respCreate['student']['wsu_id'])
        self.assertEqual('john.smith@wsu.edu', respCreate['student']['username'])

        # Now login the user
        respLogin = self.makeRequest("/api/student_login", method="POST",
                                    data={'username': 'john.smith@wsu.edu',
                                          'password': 'password'
                                    })
        self.assertSuccessResponse(respLogin)
        self.assertEqual('john.smith@wsu.edu', respLogin['result']['username'])


class TestInstructors(testLib.InstructorTestCase):

    ###
    # THESE ARE THE ACTUAL TESTS
    ###
    def testAdd1(self):
        """
            Test adding one student
            """
        respCreate = self.makeRequest("/api/instructor_signup", method="POST",
                                      data={'firstname': 'New',
                                            'lastname': 'Prof',
                                            'username': 'new.prof@wsu.edu',
                                            'password': 'password',
                                            'wsu_id': '01010101',
                                            'phone_num': '8326665551'
                                            })
        self.assertSuccessResponse(respCreate)
        self.assertEqual('new.prof@wsu.edu',
                         respCreate['instructor']['username'])

        # Now read the students
        respGet = self.getInstructors()
        self.assertSuccessResponse(respGet)
        self.assertEqual(1, len(respGet['instructors']))
        self.assertEqual(respCreate['instructor']['id'], respGet['instructors'][0]['id'])


    def testLogin(self):
        respCreate = self.makeRequest("/api/instructor_signup", method="POST",
                                      data={'firstname': 'New',
                                            'lastname': 'Prof',
                                            'username': 'new.prof@wsu.edu',
                                            'password': 'password',
                                            'wsu_id': '01010101',
                                            'phone_num': '8326665551'
                                            })
        self.assertSuccessResponse(respCreate)
        self.assertEqual('new.prof@wsu.edu', respCreate['instructor']['username'])

        # Now login the user
        respLogin = self.makeRequest("/api/instructor_login", method="POST",
                                    data={'username': 'new.prof@wsu.edu',
                                          'password': 'password'
                                    })
        self.assertSuccessResponse(respLogin)
        self.assertEqual('new.prof@wsu.edu', respLogin['result']['username'])



if __name__ == '__main__':
    unittest.main()
