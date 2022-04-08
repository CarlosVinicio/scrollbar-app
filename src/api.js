function delay(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

// get all sections in users photo library - e.g. one section per month
export const getSections = () => {
  return fetch("store.json" )
    .then((res) => {
      const response = res.json();
      return response;
    })
    // .then(delay(50 + Math.random() * 500))
    .then((store) => {
      const sections = store.sections.map((section) => {
        return {
          sectionId: section.sectionId,
          totalImages: section.totalImages,
          datesHeader: section.header
        };
      });
      return sections
    });
}

// get all segments inside one section - e.g. one segment per day
export function getSegments(sectionId) {
  return fetch("./store.json")
    .then((res) => res.json())
    .then(delay(50 + Math.random() * 500))
    .then((store) => {
      return store.sections.find((section) => section.sectionId === sectionId).segments;
    });
}
