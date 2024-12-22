let result = 0;
let typedText = "";
let typingTimer;
let typingTimer2;
const typingDelay = 1500; // 2 seconds delay
const typingDelay2 = 3000; // 3 seconds delay

function getPagePercentage() {
  const articleText = document.body.innerText;
  console.log("Article text:", articleText);
  fetch("http://127.0.0.1:5000/submit-text", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: articleText,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Response:", response);
      alert("Response: " + response);
      return response.text();
    })
    .then((text) => {
      try {
        // Try to parse text as JSON
        const data = JSON.parse(text);
        console.log("Prediction:", data);
        alert("Prediction: " + data);
      } catch (jsonError) {
        // If JSON parsing fails, try to extract the number from HTML
        console.error("Error parsing JSON:", jsonError);
        console.error("Response text:", text); // Log the response text for debugging

        const match = text.match(/Hate-o-meter:\s*([\d.]+)/);
        if (match) {
          const hateOMeterValue = parseFloat(match[1]);
          console.log("Hate-o-meter value:", hateOMeterValue);
          alert("Hate-o-meter value: " + hateOMeterValue);
          return hateOMeterValue.toFixed(2);
        } else {
          console.error("Hate-o-meter value not found in the response.");
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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
    fetch("http://127.0.0.1:5000/submit-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: typedText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Response:", response);
        return response.text();
      })
      .then((text) => {
        try {
          // Try to parse text as JSON
          const data = JSON.parse(text);
          console.log("Prediction:", data);
          alert("Prediction: " + data);
        } catch (jsonError) {
          // If JSON parsing fails, try to extract the number from HTML
          console.error("Error parsing JSON:", jsonError);
          console.error("Response text:", text); // Log the response text for debugging

          const match = text.match(/Hate-o-meter:\s*([\d.]+)/);
          if (match) {
            const hateOMeterValue = parseFloat(match[1]);
            console.log("Hate-o-meter value:", hateOMeterValue);
            if (hateOMeterValue > 0.6) {
              alert(
                "Offensive message! Please refrain from using such language."
              );
            }
          } else {
            console.error("Hate-o-meter value not found in the response.");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    typedText = ""; // Reset typedText after processing
  }, typingDelay);
}

// Add event listener to the document to capture all key presses
document.addEventListener("keydown", handleKeydownEvent);
window.onload = () => {
  try {
    const result = getPagePercentage();
    clearTimeout(typingTimer2);
    typingTimer2 = setTimeout(() => {
      console.log("Result:", result);
      alert("Result: " + result);
      chrome.runtime.sendMessage({ type: "ARTICLE_TEXT_VALUE", text: result });
      console.log("Message sent: ARTICLE_TEXT_VALUE", result);
    }, typingDelay2);
  } catch (error) {
    console.error("Error:", error);
  }
};
