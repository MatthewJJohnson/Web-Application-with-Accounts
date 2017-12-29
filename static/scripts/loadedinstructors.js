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
    $('#SaveOne').hide();
    $('#SaveTwo').hide();
    $('#SaveThree').hide();
    var toparse = window.location.href;
    var rest = toparse.split("?");
    var URLusername = rest[1];
     var onSuccess = function(data) {
       console.log(data);
       document.getElementById('idNumber').value = data.instructor.wsu_id;
       document.getElementById('instructorName').value = data.instructor.firstname + ' ' + data.instructor.lastname;
       document.getElementById('emailAddress').value = data.instructor.username;
       document.getElementById('idPhone').value = data.instructor.phone_num;

       //getting courses they teach
      GetCourses();
     }

     var onFailure = function() {//couldnt get user info (not logged in)
       $('.massiveWrap').hide();//do not show page stuff
       alert('You do not have permission to view this page.');
     }
     makeGetRequest('/api/instructor_page/'+URLusername, onSuccess, onFailure);
});

var GetCourses = function(){
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];

  onSuccess = function(data) {
      length = data.courses.length;
      if (length ==1){
        document.getElementById('CourseOne').value = data.courses[0].coursename;
        document.getElementById('labsOne').value = data.courses[0].labcount;
        document.getElementById('lecturesOne').value =data.courses[0].lectureCount;
        document.getElementById('offeredOne').value=data.courses[0].semesterOffered;
      }
      else if (length ==2) {
        document.getElementById('CourseOne').value = data.courses[0].coursename;
        document.getElementById('labsOne').value = data.courses[0].labcount;
        document.getElementById('lecturesOne').value =data.courses[0].lectureCount;
        document.getElementById('offeredOne').value=data.courses[0].semesterOffered;
        document.getElementById('CourseTwo').value = data.courses[1].coursename;
        document.getElementById('labsTwo').value = data.courses[1].labcount;
        document.getElementById('lecturesTwo').value =data.courses[1].lectureCount;
        document.getElementById('offeredTwo').value=data.courses[1].semesterOffered;
      }
      else if (length ==3) {
        document.getElementById('CourseOne').value = data.courses[0].coursename;
        document.getElementById('labsOne').value = data.courses[0].labcount;
        document.getElementById('lecturesOne').value =data.courses[0].lectureCount;
        document.getElementById('offeredOne').value=data.courses[0].semesterOffered;
        document.getElementById('CourseTwo').value = data.courses[1].coursename;
        document.getElementById('labsTwo').value = data.courses[1].labcount;
        document.getElementById('lecturesTwo').value =data.courses[1].lectureCount;
        document.getElementById('offeredTwo').value=data.courses[1].semesterOffered;
        document.getElementById('CourseThree').value = data.courses[2].coursename;
        document.getElementById('labsThree').value = data.courses[2].labcount;
        document.getElementById('lecturesThree').value =data.courses[2].lectureCount;
        document.getElementById('offeredThree').value=data.courses[2].semesterOffered;
      }
      else{
      }
  }

  var onFailure = function() {
    alert('Error. Could not get the courses you teach.');
  }
  makeGetRequest('/api/get_courses/'+URLusername, onSuccess, onFailure);
};

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

var EditOne = function(){
  if ($('#CourseOne').val() == ""){//only enter a course once. professors cant drop their courses
        document.getElementById('CourseOne').readOnly = false;
        document.getElementById('CourseOne').style.backgroundColor = "white";
  }
  document.getElementById('labsOne').readOnly = false;
  document.getElementById('lecturesOne').readOnly = false;
  document.getElementById('offeredOne').readOnly = false;

  document.getElementById('labsOne').style.backgroundColor = "white";
  document.getElementById('lecturesOne').style.backgroundColor = "white";
  document.getElementById('offeredOne').style.backgroundColor = "white";

  $(".superEdit").hide();
  $("#SaveOne").show();
}

var SaveOne = function() {
  document.getElementById('CourseOne').readOnly = true;
  document.getElementById('labsOne').readOnly = true;
  document.getElementById('lecturesOne').readOnly = true;
  document.getElementById('offeredOne').readOnly = true;
  $(".superEdit").show();
  $("#SaveOne").hide();
  var error = 0;

  var CheckName = $('#CourseOne').val();
  var prefix = CheckName.substring(0,2);
  if (prefix == 'ee' || prefix == 'EE' || prefix == 'Ee' || prefix == 'eE'){
      prefix = 'EE';}
  else if (prefix == 'ce' || prefix == 'CE' || prefix == 'Ce' || prefix == 'cE'){
    prefix = 'CE';}
  else if (prefix == 'cs' || prefix == 'CS' || prefix == 'Cs' || prefix == 'cS'){
    prefix = 'CS';}
  else{
    error =1;
  }
  var CourseName = prefix + CheckName.substring(2,5)
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];

  var update = {};
      update.instructor = URLusername;
      update.coursename = CourseName;
      update.labcount = $('#labsOne').val();
      update.lecturecount = $('#lecturesOne').val();
      update.semesterteaching = $('#offeredOne').val();

  document.getElementById('CourseOne').value = CourseName
  document.getElementById('labsOne').value = $('#labsOne').val();
  document.getElementById('lecturesOne').value = $('#lecturesOne').val();
  document.getElementById('offeredOne').value = $('#offeredOne').val();
  var onSuccess = function () {
    alert("Course Saved.");
    document.getElementById('CourseOne').style.backgroundColor = "#676a70";
    document.getElementById('labsOne').style.backgroundColor = "#676a70";
    document.getElementById('lecturesOne').style.backgroundColor = "#676a70";
    document.getElementById('offeredOne').style.backgroundColor = "#676a70";
    window.location.reload;

  };
  var onFailure = function () {alert("Save failed. Remember that you may only teach CS,EE, or CE courses.");};
  if(error ==0){
    makePostRequest('/api/update_course/' + CourseName +'/', update, onSuccess, onFailure);
  }
};

IDONE = [];//GLOBAL

var ShowCourseOne = function(){
  var coursename = document.getElementById('CourseOne').value
  var error = 0;
  if (coursename == ""){
    error =1;
  }
  var onSuccess = function(data) {
    var coursename = document.getElementById('CourseOne').value
    console.log(data);
    if(data.applicants.length == 0){
      var elementExists = document.getElementById('Unfortunate')
      if(document.getElementById('Unfortunate') == null){
        var myDiv = document.createElement("div");
        var node = document.createTextNode("Unfortunately, no students have applied to your course yet. Please check again later!");
        myDiv.id = "Unfortunate"
        myDiv.appendChild(node);

        var element = document.getElementById("talist1");
        var child = document.getElementById('TempCheck');
        element.insertBefore(myDiv, child);
      }
    }
    else{
      $("#talist1").empty();
      for(i = 0; i< data.applicants.length; i++){
        var el = document.getElementById('talist1');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.style.marginLeft = "0%";
        checkbox.id = coursename+'applicant'+i;
        IDONE[i] = coursename+'applicant'+i;
        var label = document.createElement('label');
        label.htmlFor = coursename+'applicant'+i;
        label.style.marginLeft = "1%";
        label.appendChild(document.createTextNode(data.applicants[i].student));
        el.appendChild(checkbox);
        el.appendChild(label);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Grade Received in this course: ' +data.applicants[i].gradeReceived);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist1');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant took the course: ' +data.applicants[i].semesterTook);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist1');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant is applying for: ' +data.applicants[i].semesterApplying);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist1');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Applicant has been a TA for this course previously: ' +data.applicants[i].previousTA);
        myDiv.style.marginLeft = "5%";
        myDiv.appendChild(node);
        var element = document.getElementById('talist1');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);
      }
      checkTAOne();
    }
    console.log(IDONE);
  }

  var onFailure = function() {//couldnt get user info (not logged in)
    alert("Could not get applicants. PLease try again later.");
  }
  if(error == 0){
      makeGetRequest('/api/show_applicants/'+coursename, onSuccess, onFailure);
  }
};

var checkTAOne = function() {
    var course = $('#CourseOne').val();

    var onSuccess = function(data) {
      console.log(data);
        if(data.TA != null){
          if(data.TA != "none"){
              document.getElementById(data.TA).checked = true;
          }
        }
    }

    var onFailure = function() {
      alert("Could not show your TA selection.");
    }

    makeGetRequest('/api/get_savedta/'+course+'/', onSuccess, onFailure);
};

var SaveTAOne = function(){
  var hasTA = 0;
  for (i = 0; i<IDONE.length; i++){
    if(document.getElementById(IDONE[i]).checked){
      savethisTA = IDONE[i];
      hasTA =1;
    }
  }
  if (hasTA == 0){
    savethisTA = "none";
  }
  var course = $('#CourseOne').val();

  var onSuccess = function() {
    alert("TA selection saved.");
  }

  var onFailure = function() {
    alert("Could not save your TA selection.");
  }
  makePostRequest('/api/save_ta/'+course+'/'+savethisTA+'/', {}, onSuccess, onFailure);
};

//--------------------------------------------------------------------------------------------------------------

var EditTwo = function(){
  if ($('#CourseTwo').val() == ""){//only enter a course once. professors cant drop their courses
        document.getElementById('CourseTwo').readOnly = false;
        document.getElementById('CourseTwo').style.backgroundColor = "white";
  }
  document.getElementById('labsTwo').readOnly = false;
  document.getElementById('lecturesTwo').readOnly = false;
  document.getElementById('offeredTwo').readOnly = false;

  document.getElementById('labsTwo').style.backgroundColor = "white";
  document.getElementById('lecturesTwo').style.backgroundColor = "white";
  document.getElementById('offeredTwo').style.backgroundColor = "white";

  $(".superEdit").hide();
  $("#SaveTwo").show();
}

var SaveTwo = function() {
  document.getElementById('CourseTwo').readOnly = true;
  document.getElementById('labsTwo').readOnly = true;
  document.getElementById('lecturesTwo').readOnly = true;
  document.getElementById('offeredTwo').readOnly = true;
  $(".superEdit").show();
  $("#SaveTwo").hide();
  var error = 0;

  var CheckName = $('#CourseTwo').val();
  var prefix = CheckName.substring(0,2);
  if (prefix == 'ee' || prefix == 'EE' || prefix == 'Ee' || prefix == 'eE'){
      prefix = 'EE';}
  else if (prefix == 'ce' || prefix == 'CE' || prefix == 'Ce' || prefix == 'cE'){
    prefix = 'CE';}
  else if (prefix == 'cs' || prefix == 'CS' || prefix == 'Cs' || prefix == 'cS'){
    prefix = 'CS';}
  else{
    error =1;
  }
  var CourseName = prefix + CheckName.substring(2,5)
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];

  var update = {};
      update.instructor = URLusername;
      update.coursename = CourseName;
      update.labcount = $('#labsTwo').val();
      update.lecturecount = $('#lecturesTwo').val();
      update.semesterteaching = $('#offeredTwo').val();

  document.getElementById('CourseTwo').value = CourseName
  document.getElementById('labsTwo').value = $('#labsTwo').val();
  document.getElementById('lecturesTwo').value = $('#lecturesTwo').val();
  document.getElementById('offeredTwo').value = $('#offeredTwo').val();
  var onSuccess = function () {
    alert("Course Saved.");
    document.getElementById('CourseTwo').style.backgroundColor = "#676a70";
    document.getElementById('labsTwo').style.backgroundColor = "#676a70";
    document.getElementById('lecturesTwo').style.backgroundColor = "#676a70";
    document.getElementById('offeredTwo').style.backgroundColor = "#676a70";
    window.location.reload;

  };
  var onFailure = function () {alert("Save failed. Remember that you may only teach CS,EE, or CE courses.");};
  if(error ==0){
    makePostRequest('/api/update_course/' + CourseName +'/', update, onSuccess, onFailure);
  }
};

IDTWO = [];//GLOBAL

var ShowCourseTwo = function(){
  var coursename = document.getElementById('CourseTwo').value
  var error = 0;
  if (coursename == ""){
    error =1;
  }
  var onSuccess = function(data) {
    var coursename = document.getElementById('CourseTwo').value
    console.log(data);
    if(data.applicants.length == 0){
      var elementExists = document.getElementById('Unfortunate')
      if(document.getElementById('Unfortunate') == null){
        var myDiv = document.createElement("div");
        var node = document.createTextNode("Unfortunately, no students have applied to your course yet. Please check again later!");
        myDiv.id = "Unfortunate"
        myDiv.appendChild(node);

        var element = document.getElementById("talist2");
        var child = document.getElementById('TempCheck');
        element.insertBefore(myDiv, child);
      }
    }
    else{
      $("#talist2").empty();
      for(i = 0; i< data.applicants.length; i++){
        var el = document.getElementById('talist2');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.style.marginLeft = "0%";
        checkbox.id = coursename+'applicant'+i;
        IDTWO[i] = coursename+'applicant'+i;
        var label = document.createElement('label');
        label.htmlFor = coursename+'applicant'+i;
        label.style.marginLeft = "1%";
        label.appendChild(document.createTextNode(data.applicants[i].student));
        el.appendChild(checkbox);
        el.appendChild(label);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Grade Received in this course: ' +data.applicants[i].gradeReceived);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist2');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant took the course: ' +data.applicants[i].semesterTook);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist2');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant is applying for: ' +data.applicants[i].semesterApplying);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist2');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Applicant has been a TA for this course previously: ' +data.applicants[i].previousTA);
        myDiv.style.marginLeft = "5%";
        myDiv.appendChild(node);
        var element = document.getElementById('talist2');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);
      }
      checkTATwo();
    }
  }

  var onFailure = function() {//couldnt get user info (not logged in)
    alert("Could not get applicants. PLease try again later.");
  }
  if(error == 0){
      makeGetRequest('/api/show_applicants/'+coursename, onSuccess, onFailure);
  }
};

var checkTATwo = function() {
    var course = $('#CourseTwo').val();

    var onSuccess = function(data) {
      console.log(data);
        if(data.TA != null){
          if(data.TA != "none"){
              document.getElementById(data.TA).checked = true;
          }
        }
    }

    var onFailure = function() {
      alert("Could not show your TA selection.");
    }

    makeGetRequest('/api/get_savedta/'+course+'/', onSuccess, onFailure);
};

var SaveTATwo = function(){
  var hasTA = 0;
  for (i = 0; i<IDTWO.length; i++){
    if(document.getElementById(IDTWO[i]).checked){
      savethisTA = IDTWO[i];
      hasTA =1;
    }
  }
  if (hasTA == 0){
    savethisTA = "none";
  }
  var course = $('#CourseTwo').val();

  var onSuccess = function() {
    alert("TA selection saved.");
  }

  var onFailure = function() {
    alert("Could not save your TA selection.");
  }
  makePostRequest('/api/save_ta/'+course+'/'+savethisTA+'/', {}, onSuccess, onFailure);
};

//--------------------------------------------------------------------------------------------------------------

var EditThree = function(){
  if ($('#CourseThree').val() == ""){//only enter a course once. professors cant drop their courses
        document.getElementById('CourseThree').readOnly = false;
        document.getElementById('CourseThree').style.backgroundColor = "white";
  }
  document.getElementById('labsThree').readOnly = false;
  document.getElementById('lecturesThree').readOnly = false;
  document.getElementById('offeredThree').readOnly = false;

  document.getElementById('labsThree').style.backgroundColor = "white";
  document.getElementById('lecturesThree').style.backgroundColor = "white";
  document.getElementById('offeredThree').style.backgroundColor = "white";

  $(".superEdit").hide();
  $("#SaveThree").show();
}

var SaveThree = function() {
  document.getElementById('CourseThree').readOnly = true;
  document.getElementById('labsThree').readOnly = true;
  document.getElementById('lecturesThree').readOnly = true;
  document.getElementById('offeredThree').readOnly = true;
  $(".superEdit").show();
  $("#SaveThree").hide();
  var error = 0;

  var CheckName = $('#CourseThree').val();
  var prefix = CheckName.substring(0,2);
  if (prefix == 'ee' || prefix == 'EE' || prefix == 'Ee' || prefix == 'eE'){
      prefix = 'EE';}
  else if (prefix == 'ce' || prefix == 'CE' || prefix == 'Ce' || prefix == 'cE'){
    prefix = 'CE';}
  else if (prefix == 'cs' || prefix == 'CS' || prefix == 'Cs' || prefix == 'cS'){
    prefix = 'CS';}
  else{
    error =1;
  }
  var CourseName = prefix + CheckName.substring(2,5)
  var toparse = window.location.href;
  var rest = toparse.split("?");
  var URLusername = rest[1];

  var update = {};
      update.instructor = URLusername;
      update.coursename = CourseName;
      update.labcount = $('#labsThree').val();
      update.lecturecount = $('#lecturesThree').val();
      update.semesterteaching = $('#offeredThree').val();

  document.getElementById('CourseThree').value = CourseName
  document.getElementById('labsThree').value = $('#labsThree').val();
  document.getElementById('lecturesThree').value = $('#lecturesThree').val();
  document.getElementById('offeredThree').value = $('#offeredThree').val();
  var onSuccess = function () {
    alert("Course Saved.");
    document.getElementById('CourseThree').style.backgroundColor = "#676a70";
    document.getElementById('labsThree').style.backgroundColor = "#676a70";
    document.getElementById('lecturesThree').style.backgroundColor = "#676a70";
    document.getElementById('offeredThree').style.backgroundColor = "#676a70";
    window.location.reload;

  };
  var onFailure = function () {alert("Save failed. Remember that you may only teach CS,EE, or CE courses.");};
  if(error ==0){
    makePostRequest('/api/update_course/' + CourseName +'/', update, onSuccess, onFailure);
  }
};

IDTHREE = []; //global
var ShowCourseThree = function(){
  var coursename = document.getElementById('CourseThree').value
  var error = 0;
  if (coursename == ""){
    error =1;
  }
  var onSuccess = function(data) {
    var coursename = document.getElementById('CourseThree').value
    console.log(data);
    if(data.applicants.length == 0){
      var elementExists = document.getElementById('Unfortunate')
      if(document.getElementById('Unfortunate') == null){
        var myDiv = document.createElement("div");
        var node = document.createTextNode("Unfortunately, no students have applied to your course yet. Please check again later!");
        myDiv.id = "Unfortunate"
        myDiv.appendChild(node);

        var element = document.getElementById("talist3");
        var child = document.getElementById('TempCheck');
        element.insertBefore(myDiv, child);
      }
    }
    else{
      $("#talist3").empty();
      for(i = 0; i< data.applicants.length; i++){
        var el = document.getElementById('talist3');
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.style.marginLeft = "0%";
        checkbox.id = coursename+'applicant'+i;
        IDTHREE[i] = coursename+'applicant'+i;
        var label = document.createElement('label');
        label.htmlFor = coursename+'applicant'+i;
        label.style.marginLeft = "1%";
        label.appendChild(document.createTextNode(data.applicants[i].student));
        el.appendChild(checkbox);
        el.appendChild(label);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Grade Received in this course: ' +data.applicants[i].gradeReceived);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist3');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant took the course: ' +data.applicants[i].semesterTook);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist3');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Semester applicant is applying for: ' +data.applicants[i].semesterApplying);
        myDiv.style.marginLeft = "5%";
        myDiv.style.marginBottom = "0px";
        myDiv.appendChild(node);
        var element = document.getElementById('talist3');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);

        var myDiv = document.createElement("p");
        var node = document.createTextNode('Applicant has been a TA for this course previously: ' +data.applicants[i].previousTA);
        myDiv.style.marginLeft = "5%";
        myDiv.appendChild(node);
        var element = document.getElementById('talist3');
        var child = document.getElementById(coursename+'applicant'+i);
        element.appendChild(myDiv);
      }
      checkTAThree();
    }
  }

  var onFailure = function() {//couldnt get user info (not logged in)
    alert("Could not get applicants. PLease try again later.");
  }
  if(error == 0){
      makeGetRequest('/api/show_applicants/'+coursename, onSuccess, onFailure);
  }
};

var checkTAThree = function() {
    var course = $('#CourseThree').val();

    var onSuccess = function(data) {
      console.log(data);
        if(data.TA != null){
          if(data.TA != "none"){
              document.getElementById(data.TA).checked = true;
          }
        }
    }

    var onFailure = function() {
      alert("Could not show your TA selection.");
    }

    makeGetRequest('/api/get_savedta/'+course+'/', onSuccess, onFailure);
};

var SaveTAThree = function(){
  var hasTA = 0;
  for (i = 0; i<IDTHREE.length; i++){
    if(document.getElementById(IDTHREE[i]).checked){
      savethisTA = IDTHREE[i];
      hasTA =1;
    }
  }
  if (hasTA == 0){
    savethisTA = "none";
  }
  var course = $('#CourseThree').val();

  var onSuccess = function() {
    alert("TA selection saved.");
  }

  var onFailure = function() {
    alert("Could not save your TA selection.");
  }
  makePostRequest('/api/save_ta/'+course+'/'+savethisTA+'/', {}, onSuccess, onFailure);
};

//------------------------------------------------------------------------------------------------
var editPhone = function(){
  document.getElementById('idPhone').readOnly = false;
  document.getElementById('idPhone').style.backgroundColor = "white";
  var save = document.getElementById("savePhone");
  $(".edit").hide();
  save.style.visibility = "visible";
};

var savePhone = function(){
  document.getElementById('idPhone').readOnly = true;
  document.getElementById('idPhone').style.backgroundColor = "#676a70";
  var save = document.getElementById("savePhone");
  save.style.visibility = "hidden";
  setTimeout( function () {
    $(".edit").show();
}, 50);

var toparse = window.location.href;
var rest = toparse.split("?");
var URLusername = rest[1];
var update = {};
    update.Phone = $('#idPhone').val();
var onSuccess = function () {alert("Information Saved.");
};
var onFailure = function () {alert("Save failed.");};
makePostRequest('/api/update_instructor/' + URLusername, update, onSuccess, onFailure);

};
