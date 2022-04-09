import React, { useEffect } from "react";

export const Sections = ({ sections, sectionStates}) => {
  
  const estimateSectionHeight = (section) => {
    const unwrappedWidth =
      (3 / 2) * section.totalImages * 150 * (7 / 10);
    const rows = Math.ceil(unwrappedWidth / window.innerWidth - 40);
    const height = rows * 150;

    return height;
  };

  const onChangeSectionStates = () => {

  }

  return (
    <div  style={{ position: "relative", overflow: "auto", height: "100vh" }}>
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
