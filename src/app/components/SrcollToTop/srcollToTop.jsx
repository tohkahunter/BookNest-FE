import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ smooth = false }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, smooth]);

  return null;
};

export default ScrollToTop;
