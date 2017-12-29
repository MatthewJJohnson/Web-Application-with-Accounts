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

$(document).ready(function(){
//  var loadStudent = function(){
    $('.taRadioClass').hide();//hiding TA selection buttons
    $('.superSave').hide();
    $("#nada").hide();
    var toparse = window.location.href;
    var rest = toparse.split("?");
    var URLusername = rest[1];
     var onSuccess = function(data) {
       console.log(data);
       if (data.student == {}){
         $('.massiveWrap').hide();//do not show page stuff
         alert('You do not have permission to view this page. Are you logged in?');
       }
       else {
         document.getElementById('idNumber').value = data.student.wsu_id;
         document.getElementById('studentName').value = data.student.firstname + ' ' + data.student.lastname;
         document.getElementById('emailAddress').value = data.student.username;
         document.getElementById('idPhone').value = data.student.phone_num;
         document.getElementById('idMajor').value = data.student.major;
         document.getElementById('idGPA').value = data.student.gpa;
         document.getElementById('idGrad').value = data.student.graduation_date;
         document.getElementById('idTA').value = data.student.previous_ta;
       }
     }

     var onFailure = function() {//couldnt get user info (not logged in)
       $('.massiveWrap').hide();//do not show page stuff
       alert('You do not have permission to view this page. Are you logged in?');
     }
     makeGetRequest('/api/student_page/'+URLusername, onSuccess, onFailure);
});

var Logout = function(){
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];

  var onSuccess = function () {
      window.location.href = "home.html";
    };

  var onFailure = function() {//couldnt get user info (not logged in)
    alert('Logout failure');
  };

  makeGetRequest('/api/logout/'+URLusername, onSuccess, onFailure);
};

var superEdit = function(){
  document.getElementById('idPhone').readOnly = false;
  document.getElementById('idGrad').readOnly = false;
  document.getElementById('idMajor').readOnly = false;
  document.getElementById('idGPA').readOnly = false;

  document.getElementById('idPhone').style.backgroundColor = "white";
  document.getElementById('idGrad').style.backgroundColor = "white";
  document.getElementById('idMajor').style.backgroundColor = "white";
  document.getElementById('idGPA').style.backgroundColor = "white";

//  var saved = document.getElementById("Saved");
  var radios = document.getElementById("taRadio");
  $(".whitebox").hide();
  $(".taRadioClass").show();
  $(".superEdit").hide();
  $(".superSave").show();
//  saved.style.visibility = "visible";
  radios.style.visibility = "visible";
}

var superSave = function() {
  document.getElementById('idPhone').readOnly = true;
  document.getElementById('idGrad').readOnly = true;
  document.getElementById('idMajor').readOnly = true;
  document.getElementById('idGPA').readOnly = true;
  if(document.getElementById('checkbox1').checked){document.getElementById('idTA').value = 'Yes';}
  else {document.getElementById('idTA').value = 'No';};
  //var saved = document.getElementById("Saved");
  var radios = document.getElementById("taRadio");
  $(".whitebox").show();
  $(".taRadioClass").hide();
  $(".superEdit").show();
  $(".superSave").hide();
//  saved.style.visibility = "hidden";
  radios.style.visibility = "hidden";

  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];
  var update = {};
      update.Phone = $('#idPhone').val();
      update.Grad = $('#idGrad').val();
      update.Major = $('#idMajor').val();
      update.GPA = $('#idGPA').val();
      update.TA = $('#idTA').val();
  var onSuccess = function () {
    alert("Information Saved.");
    document.getElementById('idPhone').style.backgroundColor = "#676a70";
    document.getElementById('idGrad').style.backgroundColor = "#676a70";
    document.getElementById('idMajor').style.backgroundColor = "#676a70";
    document.getElementById('idGPA').style.backgroundColor = "#676a70";
  };
  var onFailure = function () {alert("Save failed.");};
  makePostRequest('/api/update_student/' + URLusername, update, onSuccess, onFailure);

};
var APPCOUNT = 0; // Global

var newApplication = function() {
  var error_state = 0;
  var CheckName = $('#appcoursename').val();
  var prefix = CheckName.substring(0,2);
  if (prefix == 'ee' || prefix == 'EE' || prefix == 'Ee' || prefix == 'eE'){
      prefix = 'EE';}
  else if (prefix == 'ce' || prefix == 'CE' || prefix == 'Ce' || prefix == 'cE'){
    prefix = 'CE';}
  else if (prefix == 'cs' || prefix == 'CS' || prefix == 'Cs' || prefix == 'cS'){
    prefix = 'CS';}
  else{
    error_state =1;
  }
  var CourseName = prefix + CheckName.substring(2,5)

  if(document.getElementById('appcoursegrade').value == ""){
    alert("You may not submit an application with an empty course grade.");
    error_state =2;
  }
  if(document.getElementById('appcoursename').value == ""){
    error_state =1;
  }
  if(document.getElementById('appcoursetook').value == ""){
    alert("You must provide the semester you took a class to apply.");
    error_state =2;
  }
  if(document.getElementById('appcourseterm').value == ""){
    alert("You must provide the semester you are applying for.");
    error_state =2;
  }
  if(document.getElementById('appcheckbox1').checked == false && document.getElementById('appcheckbox2').checked == false){
    alert("You must state if you have been a TA for this course previously.");
    error_state =2;
  }
  var newApp = {};
    newApp.coursename = CourseName;
    newApp.gradeReceived = $('#appcoursegrade').val();
    newApp.semesterTook = $('#appcoursetook').val();
    newApp.semesterApplying = $('#appcourseterm').val();
    if(document.getElementById('appcheckbox1').checked){
      newApp.previousTA = 'yes';
    }
    else {
      newApp.previousTA = 'no';
    }

    if (APPCOUNT == 5){
      error_state = 3;
    }
    var toparse = window.location.href;
    var rest = toparse.split("?");
    var URLusername = rest[1];
    newApp.student = URLusername;

    console.log(newApp);
    var onSuccess = function() {
      alert("Application Saved.");
      location.reload();
    }
    var onFailure = function() {
      alert("Application Failed.");
    }

    if (error_state == 0){
        makePostRequest('/api/new_ta_application', newApp, onSuccess, onFailure);
    }
    else if (error_state == 3){
      alert("You have reached the maximum application limit.");
    }
    else if(error_state ==1){
          alert("Invalid Major. Please choose from CS, CE, or EE.");
    }
}

var cancelApplication = function() {
  document.getElementById('appcoursename').value = '';
  document.getElementById('appcoursegrade').value = '';
  document.getElementById('appcoursetook').value = '';
  document.getElementById('appcourseterm').value = '';
  document.getElementById('appcheckbox1').checked = false;
  document.getElementById('appcheckbox2').checked = false;
}

var GetApplication  = function() {
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];
    onSuccess = function(data) {
      console.log(data);
      document.getElementById('coursenumber1').value = data.application.coursename;
      document.getElementById('gradeInCourse1').value = data.application.gradeReceived;
      document.getElementById('semesterTookCourse1').value = data.application.semesterTook;
      document.getElementById('semesterApplyingFor1').value = data.application.semesterApplying;
      document.getElementById('prefCourseTaBefore1').value = data.application.previousTA;
    }

    var onFailure = function() {alert("Showing Courses Failed.");}
    makeGetRequest('/api/get_ta_applications/'+URLusername, onSuccess, onFailure);
}

var GetApplication2  = function() {
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];
    onSuccess = function(data) {
      console.log(data);
      length = data.applications.length
      if(length >=1)
      {
          document.getElementById('coursenumber1').value = data.applications[0].course;
      }
      if(length >=2)
      {
          document.getElementById('coursenumber2').value = data.applications[1].course;
      }
      if(length >=3)
      {
          document.getElementById('coursenumber3').value = data.applications[2].course;
      }
      if(length >=4)
      {
          document.getElementById('coursenumber4').value = data.applications[3].course;
      }
      if(length ==5)
      {
          document.getElementById('coursenumber5').value = data.applications[4].course;
          APPCOUNT = 5;
      }

      if(length <2){
        $("#nada").hide();
        $('#Number2').hide();
        $('#coursenumber2').hide();
      }
      if(length <3){
        $("#nada").hide();
        $('#Number3').hide();
        $('#coursenumber3').hide();
      }
      if(length <4){
        $("#nada").hide();
        $('#Number4').hide();
        $('#coursenumber4').hide();
      }
      if(length <5){
        $("#nada").hide();
        $('#Number5').hide();
        $('#coursenumber5').hide();
      }
      if(length == 0){
        $("#nada").show();
        $('#Number1').hide();
        $('#coursenumber1').hide();
      }
    }

    var onFailure = function() {alert("Showing Courses Failed.");}
    makeGetRequest('/api/get_ta_applications/'+URLusername, onSuccess, onFailure);
}
