let quizData = [];
let currentSetIndex = 0; // Tracks the current set (0-based index)
let currentQuestionIndex = 0; // Tracks the current question in the set (0-based index)
let score = 0;
let timer;
let timeLeft = 3000;  // 10 minutes timer
let questionSets = []; // Array to store questions divided into sets
let answeredQuestions = {}; // Object to store whether a question has been answered correctly

document.addEventListener("DOMContentLoaded", function() {
    restoreState(); // Restore the quiz state from localStorage
    loadQuizData();  // Load quiz data from JSON
    startTimer();
});

// Restore the quiz state from localStorage
function restoreState() {
    const savedSetIndex = localStorage.getItem("currentSetIndex");
    const savedQuestionIndex = localStorage.getItem("currentQuestionIndex");

    if (savedSetIndex !== null) currentSetIndex = parseInt(savedSetIndex, 10);
    if (savedQuestionIndex !== null) currentQuestionIndex = parseInt(savedQuestionIndex, 10);
}

// Save the quiz state to localStorage
function saveState() {
    localStorage.setItem("currentSetIndex", currentSetIndex);
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
}

// Function to load quiz data from JSON file
function loadQuizData() {
    const path = "questions.json";  // Path to your JSON file

    fetch(path)
        .then(response => response.json())
        .then(data => {
            quizData = data;
            questionSets = splitQuestionsIntoSets(quizData, 50);  // Split questions into sets of 50
            loadQuiz();  // Load the first set after data is fetched
        })
        .catch(error => console.error("Error loading quiz data:", error));
}

// Split questions into sets of a specific size
function splitQuestionsIntoSets(questions, setSize) {
    const sets = [];
    for (let i = 0; i < questions.length; i += setSize) {
        sets.push(questions.slice(i, i + setSize));
    }
    return sets;
}

// Load the current quiz question
function loadQuiz() {
    const currentQuestion = questionSets[currentSetIndex][currentQuestionIndex];

    // Display question number and text
    document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1}`;
    document.getElementById("question").innerText = currentQuestion.question;

    // Display options as checkboxes
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = ""; // Clear previous options
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "option";
        checkbox.value = option;
        checkbox.id = `option-${index}`;

        const label = document.createElement("label");
        label.setAttribute("for", `option-${index}`);
        label.innerText = option;

        optionElement.appendChild(checkbox);
        optionElement.appendChild(label);
        optionsContainer.appendChild(optionElement);
    });

    // Update score display
    updateScore();

    // Enable/Disable buttons for navigation
    document.getElementById("previous-button").disabled = currentQuestionIndex === 0;
    document.getElementById("next-button").style.display = currentQuestionIndex === questionSets[currentSetIndex].length - 1 ? "none" : "inline-block";
    document.getElementById("submit-button").style.display = currentQuestionIndex === questionSets[currentSetIndex].length - 1 ? "inline-block" : "none";
    document.getElementById("prev-set").disabled = currentSetIndex === 0;
    document.getElementById("next-set").disabled = currentSetIndex === questionSets.length - 1;

    // Update pagination text (e.g., Set 1 of 5)
    document.getElementById("set-indicator").innerText = `Set ${currentSetIndex + 1} of ${questionSets.length}`;
}

// Update score dynamically
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}

// Check selected answers and update the score after moving to the next question
function checkAnswer() {
    const currentQuestion = questionSets[currentSetIndex][currentQuestionIndex];
    const selectedOptions = document.querySelectorAll('input[name="option"]:checked');

    // Extract only the letter for each selected option
    const selectedValues = Array.from(selectedOptions).map(option => option.value.charAt(0));  // Extracting only the letter
    const correctAnswers = currentQuestion.answer;  // This is an array, since multiple answers can be correct

    // If the selected answers match the correct answers, update score
    if (selectedValues.toString() === correctAnswers.toString() && !answeredQuestions[currentSetIndex]?.[currentQuestionIndex]) {
        score += 5;  // 5 points for each correct answer
        if (!answeredQuestions[currentSetIndex]) answeredQuestions[currentSetIndex] = {};
        answeredQuestions[currentSetIndex][currentQuestionIndex] = true;  // Mark the question as answered
    }

    // Update score after checking answer
    updateScore();
}

// Move to the next question
document.getElementById("next-button").addEventListener("click", function() {
    checkAnswer();  // Validate and update score when moving to next question
    currentQuestionIndex++;

    if (currentQuestionIndex < questionSets[currentSetIndex].length) {
        saveState();  // Save the current state
        loadQuiz();
    }
});

// Move to the previous question
document.getElementById("previous-button").addEventListener("click", function() {
    currentQuestionIndex--;
    saveState();  // Save the current state
    loadQuiz();
});

// Move to the next set of questions
document.getElementById("next-set").addEventListener("click", function() {
    if (currentSetIndex < questionSets.length - 1) {
        currentSetIndex++;
        currentQuestionIndex = 0;  // Reset to the first question of the new set
        saveState();  // Save the current state
        loadQuiz();
    }
});

// Move to the previous set of questions
document.getElementById("prev-set").addEventListener("click", function() {
    if (currentSetIndex > 0) {
        currentSetIndex--;
        currentQuestionIndex = 0;  // Reset to the first question of the previous set
        saveState();  // Save the current state
        loadQuiz();
    }
});

// Submit the quiz and show results in a popup
document.getElementById("submit-button").addEventListener("click", function() {
    checkAnswer();
    clearInterval(timer);  // Stop the timer when the user submits the quiz
    document.getElementById("time-left").innerText = "00:00";  // Set time to 00:00
    saveState();  // Save the current state
    showPopup();  // Show the popup with the final score
});

// Show the popup with the final score
function showPopup() {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");

    popupMessage.innerText = `Your final score is: ${score}`;
    popup.style.display = "flex"; // Show the popup

    // Reload the page after a short delay (3 seconds)
    setTimeout(function() {
        location.reload();  // Reload the page to start again
    }, 3000);  // 3 seconds delay
}

// Start the timer and update the countdown every second
function startTimer() {
    timer = setInterval(function() {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("time-left").innerText = `${minutes}:${seconds < 1 ? '0' + seconds : seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);  // Stop the timer when it reaches 0
            saveState();  // Save the current state
            showPopup();  // Show the results popup if time runs out
        }
    }, 1000);
}
