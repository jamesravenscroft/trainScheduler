//initialize firebase, set variables
$(document).ready(function(){
var config={
    apiKey:"AIzaSyBO6PBXsgWToV5z0dX71DF78MUAeaKgtbw",
    authDomain:"ftrainscheduler",
    databaseURL: "https://trainscheduler-b6ee0.firebaseio.com/",
    projectId: "trainscheduler-b6ee0",
    storageBucket: "fantasticVoyage",
    messagingSenderId:"2361693643"
};

firebase.initializeApp(config);
var database= firebase.database();
//clicky click variables
var name;
var destination;
var morningTrain;
var frequency = 0;
//clicky function
$("#add-train").on("click", function(){
    event.preventDefault();
    name=$("#train-name").val().trim();
    destination= $("#destination").val().trim();
    morningTrain = $("#morning-train").val().trim();
    frequency= $("#frequency").val().trim();
//addorama
database.ref().push({
    name:name,
    destination: destination,
    morningTrain: morningTrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
});
$("form")[0].reset();
});


database.ref().on("child_added", function(childSnapshot){
    var nextArrival;
    var minsAway;
    //append time
    var firstTrainNew = moment(childSnapshot.val().morningTrain, "hh:mm").subtract(1, "years");
    //difference between current and  morningTrain
    var diffTime= moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
    var minsAway = childSnapshot.val().frequency - remainder;
var nextTrain = moment().add(minsAway, "minutes");
nextTrain= moment(nextTrain).format("hh:mm");
//display infomania
$("#add-row").append("<tr><td>" + childSnapshot.val().name +
"</td><td>" + childSnapshot.val().destination +
"</td><td>" + childSnapshot.val().frequency +
"</td><td>" + nextTrain + 
"</td><td>" + minsAway + "</td></tr>");

// console log dem errors yo
}, function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});


});
