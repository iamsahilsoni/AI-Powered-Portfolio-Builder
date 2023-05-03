import React from "react";
import "./Introduction.css";
import { NewTabAnchor } from "../../generic";

function Introduction() {
  return (
    <div className="intro">
      <div className="intro-upper-section">
        <div className="intro-left-section">
          <h4 className="beginning-line">
            <NewTabAnchor href="https://www.google.com/search?q=Namaste">
              Namaste
            </NewTabAnchor>{" "}
            World 🙏 , my name is
          </h4>
          <h1 className="name-line">Sahil Soni</h1>
          <h2 className="status-line">
            Web 2.0 is my canvas, Competitive Programming is my sport, and Web
            3.0 is the frontier I'm eager to explore.
          </h2>
        </div>
        <div className="intro-image-section">
          <img
            src="./display-pic1.jpg"
            alt="display pic 1"
            className="display-pic"
          />
        </div>
      </div>

      <h4 className="summary-line">
        With a year of industry and academic project experience under my belt,
        I've honed my proficiency in Angular, React, and Competitive
        programming. Additionally, I possess a strong foundation in data
        structures, algorithms, and database management, as well as experience
        working with frameworks like Loopback4 and technologies such Git and
        AWS.
      </h4>
    </div>
  );
}

export default Introduction;