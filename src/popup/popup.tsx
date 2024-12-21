import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/popup.css"; // Import the CSS file

const test = (
  <div>
    <h1>Hello World</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet
      orci vel neque tincidunt placerat sit amet nec ante. Vivamus blandit
      faucibus fringilla.
    </p>
    <img src="icon.png" alt=""></img>
  </div>
);
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(test);
