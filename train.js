// Initialize Firebase
var config = {
    apiKey: "AIzaSyDWopdowN77cT5LE5WJN0KS1xEH6rzcibg",
    authDomain: "train-schedules-d6a77.firebaseapp.com",
    databaseURL: "https://train-schedules-d6a77.firebaseio.com",
    projectId: "train-schedules-d6a77",
    storageBucket: "",
    messagingSenderId: "389325219568"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var initTrainTime = $("#start-input").val().trim();
    var start = moment(initTrainTime, "HH:mm").format("X");


    // Creates local "temporary" object for holding train data
    var trains = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        start: start,
    };

    database.ref().push(trains);

    // Logs everything to console

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#start-input").val("");
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var start = childSnapshot.val().start;
    var minutesAway = calculate(start, (frequency * 60))
    var arrivalTime = moment().add(minutesAway, 'minutes').format('HH:mm A')

    $('#train-table tbody').append(`<tr><td>${trainName}</td><td>${destination}</td><td>${frequency}</td><td>${arrivalTime}</td><td>${minutesAway}</td></tr>`)

    /*
      frequency = 5 
      start time = 00:00
      current time = 1:00
      if first train left at midnight and runs every 5 minutes when will the next train arrive
      60/5 = 12 train run 12 times
      (current time - start time) / frequency = times run
      (times run + 1) * frequency = next time train arrival   

    */
    function calculate(unixInitTrainTime, trainFreqSecs) {
        timeNow = moment().format("X");
        var diffInitNow = timeNow - unixInitTrainTime;
        var mod = diffInitNow % trainFreqSecs;
        var timeLeft = trainFreqSecs - mod;
        var timeMin = timeLeft / 60;
        var adjTime = Math.round(timeMin);
        return adjTime;
    }


});