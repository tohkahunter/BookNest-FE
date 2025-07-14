// hooks/useScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = (smooth = false) => {
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
};
