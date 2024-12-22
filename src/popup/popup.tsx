import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "../assets/popup.css"; // Ensure the CSS file exists and is correctly styled.

const Gauge = () => {
  const [value, setValue] = useState(0); // Tracks the gauge value
  const textInputRef = useRef(null); // Ref for the input field

  // Updates the gauge visuals
  const setGaugeValue = (gauge, value) => {
    if (!gauge) return;
    if (value < 0 || value > 1) {
      console.warn("Gauge value out of bounds:", value);
      return;
    }

    gauge.querySelector(".gauge__fill").style.transform = `rotate(${
      value / 2
    }turn)`;
    gauge.querySelector(".gauge__cover").textContent = `${Math.round(
      value * 100
    )}%`;
  };

  // Fetches the hate-o-meter value based on the input text
  const getPagePercentage = () => {
    const articleText = textInputRef.current?.value || "";
    if (!articleText.trim()) {
      alert("Please enter some text to analyze.");
      return;
    }

    fetch("http://127.0.0.1:5000/submit-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: articleText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text); // Attempt to parse as JSON
          console.log("Prediction:", data);
          alert("Prediction: " + data);
          const normalizedValue = Math.min(Math.max(data, 0), 1); // Ensure value is within bounds
          setValue(normalizedValue);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);

          // Attempt to extract the value from plain text
          const match = text.match(/Hate-o-meter:\s*([\d.]+)/);
          if (match) {
            const hateOMeterValue = parseFloat(match[1]);
            const normalizedValue = Math.min(Math.max(hateOMeterValue, 0), 1);
            console.log("Hate-o-meter value:", normalizedValue);
            setValue(normalizedValue);
          } else {
            console.error("Hate-o-meter value not found in the response.");
            alert("Could not determine the hate-o-meter value.");
          }
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        alert("An error occurred while fetching the data.");
      });
  };

  // Effect to handle gauge updates and messaging
  useEffect(() => {
    const gaugeElement = document.querySelector(".gauge");

    const port = chrome.runtime.connect({ name: "popup" });
    port.onMessage.addListener((message) => {
      if (message.type === "ARTICLE_TEXT_VALUE") {
        const newValue = parseFloat(message.text);
        console.log("Message received: ARTICLE_TEXT_VALUE", newValue);
        setValue(newValue);
        setGaugeValue(gaugeElement, newValue);
      }
    });

    // Initial gauge value setup
    setGaugeValue(gaugeElement, value);

    return () => {
      port.disconnect(); // Cleanup connection on component unmount
    };
  }, [value]);

  return (
    <div className="container">
      <p className="Header">How offensive?</p>
      <div className="gauge">
        <div className="gauge__body">
          <div className="gauge__fill"></div>
          <div className="gauge__cover"></div>
        </div>
      </div>
      <input
        type="text"
        className="text-input"
        placeholder="Enter text here"
        ref={textInputRef}
      />
      <button className="button" onClick={getPagePercentage}>
        Scan Now
      </button>
    </div>
  );
};

// Render the Gauge component
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Gauge />);
