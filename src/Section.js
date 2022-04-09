import React, { useEffect } from "react";

export const Sections = ({ sections, sectionStates}) => {
  
  useEffect(() => {          
    document.getElementById('scrolling').addEventListener('scroll', function() {
      console.log(window.scrollY);
    });
  }, [ ])
  

  return (
    <div  style={{ position: "relative", overflow: "auto", height: "100vh" }} 
    /* onScroll={prueba} */
      id="scrolling"
    >
      {sections.map((section, index) => {
        return (
          <div
            id={section.sectionId}
            key={index}
            className="section"
            style={{
              width: `${window.innerWidth - 40}px`,
              height: `${sectionStates[section.sectionId].height}px`,
              top: `${sectionStates[section.sectionId].top}px`,
              backgroundColor: 'grey'
              // left: "0px"
            }}
          ></div>
        );
      })}
    </div>
  );
};
