// utils/scrollToTop.js
export const scrollToTop = (smooth = true) => {
  if (smooth) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } else {
    window.scrollTo(0, 0);
  }
};
