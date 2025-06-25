function answer(id) {
  const answerElement = document.getElementById(id);
  answerElement.style.display = answerElement.style.display === "none" ? "block" : "none";
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

  document.cookie = "queer=" + (isQueer ? "true" : "false");
}
