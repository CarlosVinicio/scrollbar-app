// react
import { useState, useCallback, useRef, useEffect } from "react";

// style
import "./scrollBar.css";

const ScrollBar = ({ sectionStates }) => {


  useEffect(() => {
    console.log(sectionStates);
  }, [sectionStates])
  

  return (
    <div 
      className="barra"
      /* style={{ border: "solid", position: "absolute", top: 0, right: 0, bottom: 0, width: "20px" }} */
    >

    </div>
  );
};

export default ScrollBar;
