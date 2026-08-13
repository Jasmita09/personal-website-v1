// Security Tip Generator
const facts = [
  "Use strong, unique passwords for every online account.",
  "Enable Multi-Factor Authentication (MFA) whenever possible.",
  "Never click on suspicious links or unexpected email attachments.",
  "Keep your software and operating systems regularly updated.",
  "Always lock your workstation screen when stepping away."
];

let factCount = 0;

function showNextFact() {
  const factDisplay = document.getElementById('fact-display');
  if (factDisplay) {
    factDisplay.innerHTML = facts[factCount];
    factCount = (factCount + 1) % facts.length;
  }
}

// Personality Quiz Logic
var hardwareScore = 0;
var softwareScore = 0;
var questionCount = 0;

function Builder() {
  hardwareScore += 1;
  questionCount += 1;
  if (questionCount === 3) {
    updateResult();
  }
}

function Thinker() {
  softwareScore += 1;
  questionCount += 1;
  if (questionCount === 3) {
    updateResult();
  }
}

function updateResult() {
  var result = document.getElementById("result");
  if (result) {
    if (hardwareScore >= 2) {
      result.innerHTML = "Result: You align with Data Engineering & Infrastructure!";
    } else if (softwareScore >= 2) {
      result.innerHTML = "Result: You align with Data Science & Analytics!";
    }
  }
}

function restartQuiz() {
  var result = document.getElementById("result");
  if (result) {
    result.innerHTML = "Your result will appear here...";
  }
  hardwareScore = 0;
  softwareScore = 0;
  questionCount = 0;
}

// Clock & Alert Utilities
function showAlert() {
  alert("Welcome to Jasmita's Data Science Web Portfolio!");
}

function updateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var timeofday = hours >= 12 ? 'pm' : 'am';

  if (hours > 12) hours = hours - 12;
  if (hours === 0) hours = 12;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + timeofday;
  var myClock = document.getElementById('clock');
  if (myClock) {
    myClock.innerHTML = currentTime;
  }
}

function toggleClock() {
  var myClock = document.getElementById('clock');
  var clockButton = document.getElementById('clockButton');

  if (myClock && clockButton) {
    if (myClock.style.display === 'none') {
      myClock.style.display = 'block';
      clockButton.innerHTML = 'Hide Clock';
    } else {
      myClock.style.display = 'none';
      clockButton.innerHTML = 'Show Clock';
    }
  }
}

// Video Controls API
function playVideo() {
  var video = document.getElementById('myvideo');
  if (video) video.play();
}

function pauseVideo() {
  var video = document.getElementById('myvideo');
  if (video) video.pause();
}

function changeSpeed(direction) {
  var video = document.getElementById('myvideo');
  if (video) {
    if (direction === 'up') video.playbackRate += 0.25;
    else if (direction === 'down') video.playbackRate -= 0.25;
  }
}

function changeVolume(direction) {
  var video = document.getElementById('myvideo');
  if (video) {
    if (direction === 'up' && video.volume < 0.9) video.volume += 0.1;
    else if (direction === 'down' && video.volume > 0.1) video.volume -= 0.1;
  }
}

// Event Setup
document.addEventListener("DOMContentLoaded", function() {
  var factBtn = document.getElementById('fact-btn');
  if (factBtn) {
    factBtn.addEventListener('click', showNextFact);
  }

  var q1a1 = document.getElementById("q1a1");
  var q1a2 = document.getElementById("q1a2");
  var q2a1 = document.getElementById("q2a1");
  var q2a2 = document.getElementById("q2a2");
  var q3a1 = document.getElementById("q3a1");
  var q3a2 = document.getElementById("q3a2");
  var restartBtn = document.getElementById("restart");

  if (q1a1) {
    q1a1.addEventListener("click", Builder);
    q1a2.addEventListener("click", Thinker);
    q2a1.addEventListener("click", Builder);
    q2a2.addEventListener("click", Thinker);
    q3a1.addEventListener("click", Builder);
    q3a2.addEventListener("click", Thinker);
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", restartQuiz);
  }
});
