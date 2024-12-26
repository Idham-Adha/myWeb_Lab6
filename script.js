const questions = [
  { question: "What is the capital city of Malaysia?", options: ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh"], 
    answer: "Kuala Lumpur" },
  { question: "What is Malaysia's national dish?", options: ["Char Kway Teow", "Nasi Lemak", "Roti Canai", "Laksa"], 
    answer: "Nasi Lemak" },
  { question: "Which year did Malaysia gain independence?", options: ["1955", "1957", "1963", "1971"], 
    answer: "1957" },
  { question: "What is the tallest twin towers in Malaysia?", options: ["KL Tower", "Petronas Towers", "Menara Merdeka",
     "Tun Razak Tower"], answer: "Petronas Towers" },
  { question: "Which Malaysian state is famous for its historical city, Malacca?", options: ["Johor", "Selangor", "Melaka", "Pahang"],
     answer: "Melaka" },
  { question: "Which island in Malaysia is a popular diving destination?", options: ["Langkawi", "Tioman", "Penang", "Sipadan"], 
    answer: "Sipadan" },
  { question: "What is the currency of Malaysia?", options: ["Dollar", "Ringgit", "Baht", "Rupiah"], 
    answer: "Ringgit" }
];

let currentQuestionIndex = 0;
let shuffledQuestions = [];
let score = 0;
let timer;
let timeLeft;
let highScore = localStorage.getItem("highScore") || 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("time");
const resultContainer = document.getElementById("result-container");
const scoreEl = document.getElementById("score");
const quizContainer = document.getElementById("quiz-container");
const skipBtn = document.getElementById("skip-btn");
const introContainer = document.getElementById("intro");

document.getElementById("start-btn").addEventListener("click", startQuiz);
skipBtn.addEventListener("click", skipQuestion);

function shuffleQuestions() {
  return questions.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  introContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = shuffleQuestions();
  displayQuestion();
}

function displayQuestion() {
  resetTimer();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  optionsEl.innerHTML = "";

  currentQuestion.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => handleAnswer(option);
    optionsEl.appendChild(button);
    button.setAttribute("tabindex", "0");
  });
  startTimer();
}

function startTimer() {
  timeLeft = 20;
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showCorrectAnswer(false);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
}

function handleAnswer(selected) {
  const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;
  const isCorrect = selected === correctAnswer;

  if (isCorrect) {
    score++;
    showFeedback("Correct!", true);
  } else {
    showFeedback(`Incorrect! The correct answer was: ${correctAnswer}`, false);
  }

  nextQuestion();
}

function showFeedback(message, isCorrect) {
  const feedback = document.createElement("p");
  feedback.textContent = message;
  feedback.style.color = isCorrect ? "green" : "red";
  optionsEl.appendChild(feedback);
}

function showCorrectAnswer(isSkipped) {
  const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;
  const message = isSkipped
    ? `Time's up! The correct answer was: ${correctAnswer}`
    : `The correct answer was: ${correctAnswer}`;

  showFeedback(message, false);
  setTimeout(nextQuestion, 2000); // Auto move to the next question
}

function skipQuestion() {
  resetTimer();
  showCorrectAnswer(true);
}

function nextQuestion() {
  currentQuestionIndex++;
  setTimeout(() => {
    if (currentQuestionIndex < shuffledQuestions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${shuffledQuestions.length}`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    scoreEl.textContent += ` (New High Score!)`;
  }
}
