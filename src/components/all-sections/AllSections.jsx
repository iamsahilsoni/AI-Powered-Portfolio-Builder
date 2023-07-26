import React from "react";
import About from "./about/About";
import Experience from "./experience/Experience";
import Work from "./project-work/Work";
import Contact from "./contact/Contact";
import "./AllSections.css";
import Introduction from "./introduction/Introduction";

function AllSections({
  experiences,
  projectWork,
  contactInfo,
  introInfo,
  aboutInfo,
  image1,
  image2
}) {
  return (
    <div className="all-sections">
      <Introduction {...introInfo} image1={image1} image2={image2} />
      <About {...aboutInfo} image1={image1} image2={image2}/>
      <Experience experiences={experiences} />
      <Work projectWork={projectWork} />
      <Contact {...contactInfo} />
    </div>
  );
}

export default AllSections;
