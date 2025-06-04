import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // ページ先頭に移動
  }, [pathname]);

  return null;
};

export default ScrollToTop;
