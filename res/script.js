function answer(id) {
  const answerElement = document.getElementById(id);
  if (answerElement.style.display === "none") {
    answerElement.style.display = "block";
  } else {
    answerElement.style.display = "none";
  }
}
