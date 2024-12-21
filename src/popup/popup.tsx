import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../assets/popup.css"; // Import the CSS file

const Gauge = () => {

  function addValue(){
    const value = 0.2
    return value
  }
  useEffect(() => {
    const gaugeElement = document.querySelector(".gauge");

    function setGaugeValue(gauge, value) {
      if (value < 0 || value > 1) {
        return;
      }

      gauge.querySelector(".gauge__fill").style.transform = `rotate(${value / 2}turn)`;
      gauge.querySelector(".gauge__cover").textContent = `${Math.round(value * 100)}%`;
    }

    const value = addValue();

    setGaugeValue(gaugeElement, value); // Example usage
  }, []);

  return (
    <div>
      <p class="Header">How offensive?</p>
      <div className="gauge">
        <div className="gauge__body">
          <div className="gauge__fill"></div>
          <div className="gauge__cover"></div>
        </div>
      </div>
      <button class="button">Scan Now</button>
    </div>
    
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Gauge />);