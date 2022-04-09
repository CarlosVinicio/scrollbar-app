// react
import { useState, useCallback, useRef, useEffect } from "react";

// style
import "./scrollBar.css";

const ScrollBar = ({ sectionStates }) => {
  const mouse = (x) => {
    console.log(x);
  }

  return (
    <div className="barra">
      <div>-</div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", height: "95%" }} >
      {Object.keys(sectionStates).map((keySection, index) => {
        const currentSection = sectionStates[keySection]
        return (     
          <div key={index}>
          
            <div onMouseEnter={() => mouse(currentSection)}>*</div>
          </div>
        );
      })}
       </div>
    </div>
  );
};

export default ScrollBar;
