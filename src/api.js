import store from "./store.json";

let delayTimer;

export const getSections = () => {
  return new Promise((resolve) => {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      resolve(store);
    }, 1000);
  });
};

export const getSegments = (sectionId) => {
  return new Promise((resolve) => {
    const response = store.find(
      (section) => section.sectionId == sectionId
    ).segments;
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      resolve(response);
    }, 1000);
  });
};
