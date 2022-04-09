// react
import { useEffect, useState } from "react";

// styles
import "./App.css";

// justified-layout
import justifiedLayout from "justified-layout";

// api
import { getSections, getSegments } from "./api";

// scrollbar
import ScrollBar from "./ScrollBar";
import { Sections } from "./Section";

const config = {
  containerWidth: window.innerWidth - 40,
  targetRowHeight: 150,
  segmentsMargin: 20,
  sectionMargin: 20,
};

function App() {
  const [sections, setSections] = useState([]);
  const [sectionStates, setSectionStates] = useState([]);
  // let sectionStates = {};
  var prevSectionEnd = config.sectionMargin;

  useEffect(() => {
    loadUi();
  }, []);

  useEffect(() => {
    document
      .querySelectorAll(".section")
      .forEach(sectionObserver.observe.bind(sectionObserver));
  }, [sections]);


  const initSectionStates = (sections) => {
    let localStates = {};
    sections.forEach((section) => {
      localStates[section.sectionId] = {
        ...section,
        lastUpdateTime: -1,
        height: estimateSectionHeight(section),
        top: prevSectionEnd,
      };
      prevSectionEnd +=
      localStates[section.sectionId].height + 20;
    })
    setSectionStates(localStates);
  }

  const updateSectionStates = ( currentSectionStates ) => {
    
  }

  const loadUi = async () => {
    const sections = await getSections();
    if (sections) {
      setSections(sections);
      initSectionStates(sections);
      window.scrollTo({ top: 0 });
    }
  };

  // handle scroll event
  const handleScrollEvent = (e) => {
    console.dir(e.target.scrollTop);
  };

  const estimateSectionHeight = (section) => {
    const unwrappedWidth =
      (3 / 2) * section.totalImages * config.targetRowHeight * (7 / 10);
    const rows = Math.ceil(unwrappedWidth / config.containerWidth);
    const height = rows * config.targetRowHeight;

    return height;
  };

  // populates section with actual segments html
  const populateSection = (sectionDiv, segments) => {
    let sectionId = sectionDiv.id;
    let segmentsHtml = "";
    let prevSegmentEnd = config.segmentsMargin;
    for (const segment of segments) {
      const segmentInfo = getSegmentHtmlAndHeight(segment, prevSegmentEnd);
      segmentsHtml += segmentInfo.html;
      prevSegmentEnd += segmentInfo.height + config.segmentsMargin;
    }

    // add segments to section and calculate new height
    sectionDiv.innerHTML = segmentsHtml;
    const newSectionHeight = prevSegmentEnd;
    const oldSectionHeight = sectionStates[sectionId].height;

    // adjust all next section's top if height of this section was modified
    const heightDelta = newSectionHeight - oldSectionHeight;
    if (heightDelta == 0) {
      return;
    }

    sectionStates[sectionId].height = newSectionHeight;
    sectionDiv.style.height = `${newSectionHeight}px`;

    Object.keys(sectionStates).forEach((sectionToAdjustId) => {
      if (sectionToAdjustId >= sectionId) {
        return;
      }

      sectionStates[sectionToAdjustId].top += heightDelta;
      const sectionToAdjustDiv = document.getElementById(sectionToAdjustId);
      sectionToAdjustDiv.style.top = `${sectionStates[sectionToAdjustId].top}px`;
    });

    // adjust scroll if user is scrolling upwords and we loaded some section above current scroll position
    if (window.scrollY > sectionStates[sectionId].top) {
      window.scrollBy(0, heightDelta);
    }
  };

  // generates Segment html and height
  const getSegmentHtmlAndHeight = (segment, top) => {
    const sizes = segment.images.map((image) => image.metadata);
    var geometry = justifiedLayout(sizes, config);

    // gets tiles for each box given by justified layout lib
    var tiles = geometry.boxes
      .map((box, index) => getTileHtml(box, segment.images[index]))
      .join("\n");

    return {
      html: `<div id="${segment.segmentId}" class="segment" style="width: ${config.containerWidth}px; height: ${geometry.containerHeight}px; top: ${top}px; left: 0px;">${tiles}</div>`,
      height: geometry.containerHeight,
    };
  };

  // generates Tile html
  const getTileHtml = (box, image) => {
    // const url = 'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg'
    return `<img class="tile" src="${image.url}" style="width: ${box.width}px; height: ${box.height}px; left: ${box.left}px; top: ${box.top}px;" />`;
  };

  // detaches section by removing childs of section div and keeping same height
  const detachSection = (sectionDiv) => {
    sectionDiv.innerHTML = "";
  };

  // handle when there is change for section intersecting viewport
  const handleSectionIntersection = (entries, observer) => {
    let tempSectionsStates = {...tempSectionsStates};

    entries.forEach((entry) => {
      const sectionDiv = entry.target;
      sectionStates[sectionDiv.id].lastUpdateTime = entry.time;

      if (entry.isIntersecting) {
        getSegments(sectionDiv.id).then((segments) => {
          window.requestAnimationFrame(() => {
            if (sectionStates[sectionDiv.id].lastUpdateTime === entry.time) {
              populateSection(sectionDiv, segments);
            }
          });
        });
      } else {
        window.requestAnimationFrame(() => {
          if (sectionStates[sectionDiv.id].lastUpdateTime === entry.time) {
            detachSection(sectionDiv, entry.time);
          }
        });
      }
    });
  };

  const sectionObserver = new IntersectionObserver(handleSectionIntersection, {
    rootMargin: "200px 0px",
  });

  return (
    <div className="contenedor">   
      <Sections sections={sections} sectionStates={sectionStates} />
      <ScrollBar sectionStates={sectionStates}/>
    </div>
  );
}

export default App;
