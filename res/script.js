function answer(id) {
  const answerElement = document.getElementById(id);
  if (answerElement.style.display === "none") {
    answerElement.style.display = "block";
  } else {
    answerElement.style.display = "none";
  }
}

function startGame(isQueer) {
  const activeElement = document.getElementsByClassName("game active")[0];
  const waitingElement = document.getElementsByClassName("game waiting")[0];
  if (activeElement) {
    activeElement.classList.remove("active");
    activeElement.classList.add("inactive");
  }
  if (waitingElement) {
    waitingElement.classList.add("active");
  }

  if (isQueer) {
    document.cookie = "queer=true";
  } else {
    document.cookie = "queer=false";
  }
}
