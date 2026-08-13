// ==========================================
// 1. DATA PRIVACY & SECURITY FACT GENERATOR
// ==========================================
const facts = [
  "Data Tip 1: Implement differential privacy techniques when analyzing sensitive datasets.",
  "Data Tip 2: Use strong end-to-end encryption (AES-256) for data both in transit and at rest.",
  "Data Tip 3: Regularly audit data pipelines for access privilege drift and compliance risks.",
  "Data Tip 4: Enforce Multi-Factor Authentication (MFA) across all cloud analytics platforms.",
  "Data Tip 5: Anonymize or pseudonomize Personally Identifiable Information (PII) before model training."
];

let factIndex = 0;

function setupFactGenerator() {
  const factBtn = document.getElementById('fact-btn');
  const factDisplay = document.getElementById('fact-display');

  if (factBtn && factDisplay) {
    factBtn.addEventListener('click', () => {
      factDisplay.innerText = facts[factIndex];
      factIndex = (factIndex + 1) % facts.length;
    });
  }
}

// ==========================================
// 2. DATA SCIENCE PERSONA QUIZ
// ==========================================
let analyticsScore = 0;
let engineeringScore = 0;
let answeredQuestions = 0;

function setupQuiz() {
  const q1a1 = document.getElementById("q1a1");
  const q1a2 = document.getElementById("q1a2");
  const q2a1 = document.getElementById("q2a1");
  const q2a2 = document.getElementById("q2a2");
  const q3a1 = document.getElementById("q3a1");
  const q3a2 = document.getElementById("q3a2");
  const restartBtn = document.getElementById("restart");

  if (!q1a1) return; // Exit if not on quiz page

  // Question 1
  q1a1.addEventListener("click", () => recordAnswer('analytics', q1a1, q1a2));
  q1a2.addEventListener("click", () => recordAnswer('engineering', q1a2, q1a1));

  // Question 2
  q2a1.addEventListener("click", () => recordAnswer('analytics', q2a1, q2a2));
  q2a2.addEventListener("click", () => recordAnswer('engineering', q2a2, q2a1));

  // Question 3
  q3a1.addEventListener("click", () => recordAnswer('analytics', q3a1, q3a2));
  q3a2.addEventListener("click", () => recordAnswer('engineering', q3a2, q3a1));

  if (restartBtn) {
    restartBtn.addEventListener("click", resetQuiz);
  }
}

function recordAnswer(type, selectedBtn, otherBtn) {
  if (selectedBtn.disabled) return;

  if (type === 'analytics') analyticsScore++;
  else engineeringScore++;

  selectedBtn.disabled = true;
  otherBtn.disabled = true;
  selectedBtn.style.opacity = "0.6";
  otherBtn.style.opacity = "0.3";

  answeredQuestions++;

  if (answeredQuestions === 3) {
    updateQuizResult();
  }
}

function updateQuizResult() {
  const resultDisplay = document.getElementById("result");
  if (!resultDisplay) return;

  if (analyticsScore > engineeringScore) {
    resultDisplay.innerText = "Persona Match: Data Scientist / Business Intelligence Specialist!";
  } else {
    resultDisplay.innerText = "Persona Match: Data Engineer / Data Security Architect!";
  }
}

function resetQuiz() {
  analyticsScore = 0;
  engineeringScore = 0;
  answeredQuestions = 0;

  const buttons = document.querySelectorAll('.quiz-section button.btn-outline');
  buttons.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = "1";
  });

  const resultDisplay = document.getElementById("result");
  if (resultDisplay) {
    resultDisplay.innerText = "Your result will appear here...";
  }
}

// ==========================================
// 3. REAL-TIME DIGITAL CLOCK
// ==========================================
function startClock() {
  updateTime();
  setInterval(updateTime, 1000);
}

function updateTime() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  const timeOfDay = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  clockElement.innerText = `${hours}:${minutes}:${seconds} ${timeOfDay}`;
}

function toggleClock() {
  const clock = document.getElementById('clock');
  const clockBtn = document.getElementById('clockButton');

  if (clock && clockBtn) {
    if (clock.style.display === 'none') {
      clock.style.display = 'inline-block';
      clockBtn.innerText = 'Hide Clock';
    } else {
      clock.style.display = 'none';
      clockBtn.innerText = 'Show Clock';
    }
  }
}

// ==========================================
// 4. VIDEO PLAYER CONTROLS API
// ==========================================
let video;

function setupVideo() {
  video = document.getElementById('myvideo');
}

function playVideo() {
  if (video) video.play();
}

function pauseVideo() {
  if (video) video.pause();
}

function changeSpeed(direction) {
  if (!video) return;
  if (direction === 'up' && video.playbackRate < 4.0) {
    video.playbackRate += 0.25;
  } else if (direction === 'down' && video.playbackRate > 0.5) {
    video.playbackRate -= 0.25;
  }
}

function changeVolume(direction) {
  if (!video) return;
  if (direction === 'up' && video.volume < 0.9) {
    video.volume += 0.1;
  } else if (direction === 'down' && video.volume > 0.1) {
    video.volume -= 0.1;
  }
}

// Initialize scripts
document.addEventListener('DOMContentLoaded', () => {
  setupFactGenerator();
  setupQuiz();
  setupVideo();
});
