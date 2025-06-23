function answer(id) {
  const answerElement = document.getElementById(id);
  if (answerElement.style.display === "none") {
    answerElement.style.display = "block";
  } else {
    answerElement.style.display = "none";
  }
}

function startGame(queer) {
  const activeElement = document.getElementsByClassName("game active")[0];
  const inactiveElement = document.getElementsByClassName("game inactive")[0];
  if (activeElement) {
    activeElement.classList.remove("active");
    activeElement.classList.add("inactive");
  }
  if (inactiveElement) {
    inactiveElement.classList.remove("inactive");
    inactiveElement.classList.add("active");
  }

  if (queer) {
    document.cookie = "queer=true";
  } else {
    document.cookie = "queer=false";
  }
}
