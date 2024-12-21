/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./src/contentScript/contentScript.js ***!
  \********************************************/
let typedText = "";
let typingTimer;
const typingDelay = 2000; // 2 seconds delay

// Function to handle keydown events
function handleKeydownEvent(event) {
  const keyPressed = event.key;

  // Handle special keys (e.g., Backspace)
  if (keyPressed === "Backspace") {
    typedText = typedText.slice(0, -1);
  } else if (keyPressed.length === 1) {
    typedText += keyPressed;
  }

  // Clear the previous timer
  clearTimeout(typingTimer);

  // Set a new timer
  typingTimer = setTimeout(() => {
    alert("Finished typing: " + typedText);
    fetch("http://your-server-url/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: typedText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Prediction:", data.prediction);
        alert("Prediction: " + data.prediction);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    typedText = ""; // Reset typedText after processing
  }, typingDelay);
}

// Add event listener to the document to capture all key presses
document.addEventListener("keydown", handleKeydownEvent);

/******/ })()
;
//# sourceMappingURL=contentScript.js.map