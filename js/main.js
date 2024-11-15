let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("header h1").innerHTML = gameName;
document.querySelector("footer h3 span").innerHTML = gameName;

//########################## game code ##########################

let numberOfTry = 6;
let currentTry = 1;
let randomCategory = categories[Math.floor(Math.random() * categories.length)];
let randomWord = Math.floor(Math.random() * WordObject[randomCategory].length);
let wordToGuess = WordObject[`${randomCategory}`][randomWord];
let numberOfLetter = wordToGuess.length;
let messageArea = document.querySelector(".message");
let messageMsg = document.querySelector(".message p");
let theCategory = document.querySelector(".category");
theCategory.innerHTML = randomCategory;

let hintNumber;
if (numberOfLetter <= 4) {
  hintNumber = 1;
} else if (numberOfLetter <= 6) {
  hintNumber = 2;
} else {
  hintNumber = 3;
}

//########################## generate the inputs ##########################
function generateInputs() {
  let inputsContainer = document.querySelector("section .inputs");
  for (let i = 1; i <= numberOfTry; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    if (i !== currentTry) {
      tryDiv.classList.add("disabled");
    }
    for (let j = 1; j <= numberOfLetter; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}_letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }

  // focus first input
  inputsContainer.children[0].children[1].focus();

  let theInputs = document.querySelectorAll("section .inputs input");
  theInputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      // input to UpperCase
      this.value = this.value.toUpperCase();
      // move to the next input when write letter
      let nextInput = theInputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    });
  });
  const inputInDisabledDiv = document.querySelectorAll(".disabled input");
  inputInDisabledDiv.forEach((input) => (input.disabled = true));
}

const checkBtn = document.querySelector(".check");
checkBtn.addEventListener("click", guessFunc);
function guessFunc() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetter; i++) {
    let inputField = document.querySelector(`#guess-${currentTry}_letter-${i}`);
    let letter = inputField.value.toUpperCase();
    let actualLetter = wordToGuess[i - 1];
    if (letter === actualLetter) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      successGuess = false;
      inputField.classList.add("not-in-place");
    } else {
      successGuess = false;
      inputField.classList.add("no");
    }
  }
  // ##################### check #######################
  if (successGuess) {
    let allInputs = document.querySelectorAll(".inputs > div");
    allInputs.forEach((i) => i.classList.add("disabled"));
    messageArea.style.display = "block";
    messageMsg.innerHTML = `You win, the word is <span>${wordToGuess}</span>`;
    checkBtn.disabled = true;
    hintBtn.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled");
    let currentTryInput = document.querySelectorAll(`.try-${currentTry} input`);
    currentTryInput.forEach((input) => (input.disabled = true));

    currentTry++;

    let nextTryInput = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInput.forEach((input) => (input.disabled = false));
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
      el.children[1].focus();
    } else {
      messageArea.style.display = "block";
      messageMsg.innerHTML = `You lose, the word is <span>${wordToGuess}</span>`;
      checkBtn.disabled = true;
      hintBtn.disabled = true;
    }
  }
}
// ################## hint function ####################

document.querySelector(".hint span").innerHTML = hintNumber;
let hintBtn = document.querySelector(".hint");
hintBtn.addEventListener("click", hintFunc);
function hintFunc() {
  if (hintNumber > 0) {
    hintNumber--;
    document.querySelector(".hint span").innerHTML = hintNumber;
  }
  if (hintNumber === 0) {
    hintBtn.disabled = true;
  }
  let enableInputs = document.querySelectorAll(".inputs input:not([disabled])");
  let emptyInputs = Array.from(enableInputs).filter((i) => i.value === "");
  if (emptyInputs.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyInputs.length);
    let randomInput = emptyInputs[randomIndex];
    let inputToFill = Array.from(enableInputs).indexOf(randomInput);
    if (inputToFill !== -1) {
      randomInput.value = wordToGuess[inputToFill].toUpperCase();
      randomInput.classList.add("in-place");
      randomInput.style.pointerEvents = "none";
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    e.target.value = "";
  }
});

let showDetailsBtn = document.querySelector(".show-details");
showDetailsBtn.addEventListener("click", () => {
  document.querySelector("aside").classList.toggle("active");
});

let playAgainBtn = document.querySelector(".message button");
playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});

window.onload = function () {
  generateInputs();
};
