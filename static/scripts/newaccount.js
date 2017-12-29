    var apiUrl = 'http://localhost:5000';

    // PRIVATE METHODS

   /**
    * HTTP GET request
    * @param  {string}   url       URL path, e.g. "/api/smiles"
    * @param  {function} onSuccess   callback method to execute upon request success (200 status)
    * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
    * @return {None}
    */
   var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };

    /**
     * HTTP POST request
     * @param  {string}   url       URL path, e.g. "/api/smiles"
     * @param  {Object}   data      JSON data to send in request body
     * @param  {function} onSuccess   callback method to execute upon request success (200 status)
     * @param  {function} onFailure   callback method to execute upon request failure (non-200 status)
     * @return {None}
     */
    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
    var instructlogin = function(){
    var Login = {};
    var error_state = 0;
    Login.username = $('.username-input').val();
    Login.password = $('.password-input').val();
    if(Login.username == ""){alert("Username cannot be empty."); error_state=1;}
    if(Login.password == ""){alert("Password cannot be empty."); error_state=1;}
    var onSucess = function () {
      window.location.href = "instructor_homepage.html?" + Login.username;
    };
    var onFailure = function () {alert("incorrect username or password");};
    if(error_state == 0){
    makePostRequest('/api/instructor_login', Login, onSucess, onFailure);
    }
    };

    var studlogin = function(){
    var Login = {};
    var error_state = 0;
    Login.username = $('.student-username-input').val();
    Login.password = $('.student-password-input').val();
    if(Login.username == ""){alert("Username cannot be empty."); error_state=1;}
    if(Login.password == ""){alert("Password cannot be empty."); error_state=1;}
    var onSucess = function () {
      window.location.href = "student_homepage.html?" + Login.username;
    };
    var onFailure = function () {alert("incorrect username or password");};
    if(error_state == 0){
    makePostRequest('/api/student_login', Login, onSucess, onFailure);
    }
    };

    var insertInstructorAccount = function() {
    var newInstructor = {};
    var error_state = 0;
        newInstructor.username = $('.username-input').val();
        newInstructor.firstname = $('.firstname-input').val();
        newInstructor.lastname = $('.lastname-input').val();
        newInstructor.wsu_id = $('.wsuid-input').val();
        newInstructor.phone_num = $('.phone-input').val();
        newInstructor.password = $('.password-input').val();
        if(newInstructor.username == ""){alert("Username cannot be empty."); error_state=1;}
        if(newInstructor.firstname == ""){alert("Firstname cannot be empty."); error_state=1;}
        if(newInstructor.lastname == ""){alert("Lastname cannot be empty."); error_state=1;}
        if(newInstructor.wsu_id == ""){alert("WSU ID cannot be empty."); error_state=1;}
        if(newInstructor.phone_num == ""){alert("Phone Number cannot be empty."); error_state=1;}
        if(newInstructor.password == ""){alert("Password cannot be empty."); error_state=1;}
        var onSucess = function () {alert("Account creation successful. Redirecting...");
        window.location.href = "home.html";
        };
        var onFailure = function () {alert("Sign-Up failed. This is likely you are mising a field or because somebody else has this username or WSU ID. Have you created an account before? If so, please log in instead.")};
        if(error_state==0){
        makePostRequest('/api/instructor_signup', newInstructor, onSucess, onFailure);
        }
    };


    var insertStudentAccount = function() {
    var newStudent = {};
    var error_state=0;
        newStudent.username = $('.username-input').val();
        newStudent.firstname = $('.firstname-input').val();
        newStudent.gpa = $('.gpa-input').val();
        newStudent.lastname = $('.lastname-input').val();
        newStudent.wsu_id = $('.wsuid-input').val();
        newStudent.phone_num = $('.phone-input').val();
        newStudent.password = $('.password-input').val();
        newStudent.major = $('.major-input').val();
        newStudent.graduation_date = $('.graduation-input').val();
        if(document.getElementById('checkbox1').checked){
            newStudent.previous_ta = 'Yes';}
        else {newStudent.previous_ta = 'No';};
        if(newStudent.username == ""){alert("Username cannot be empty."); error_state=1;}
        if(newStudent.firstname == ""){alert("Firstname cannot be empty."); error_state=1;}
        if(newStudent.lastname == ""){alert("Lastname cannot be empty."); error_state=1;}
        if(newStudent.gpa == ""){alert("Gpa cannot be empty."); error_state=1;}
        if(newStudent.wsu_id == ""){alert("WSU ID cannot be empty.");}
        if(newStudent.phone_num == ""){alert("Phone Number cannot be empty."); error_state=1;}
        if(newStudent.password == ""){alert("Password cannot be empty."); error_state=1;}
        if(newStudent.major == ""){alert("Major cannot be empty."); error_state=1;}
        if(newStudent.graduation_date == ""){alert("Graduation date cannot be empty."); error_state=1;}
        if(newStudent.previous_ta == ""){alert("Please check whether or not you have been a TA before."); error_state=1;}
        var onSucess = function () {alert("Account creation successful. Redirecting...");
        window.location.href = "home.html";
        };
        var onFailure = function () {alert("Sign-Up failed. This is likely you are mising a field or because somebody else has this username or WSU ID. Have you created an account before? If so, please log in instead.")};
        console.log(newStudent);
        if(error_state == 0){
        makePostRequest('/api/student_signup', newStudent, onSucess, onFailure);
        }
    };
