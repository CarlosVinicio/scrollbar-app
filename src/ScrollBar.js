// react
import { useState, useCallback, useRef, useEffect } from "react";

// style
import "./scrollBar.css";

const SCROLL_BOX_MIN_HEIGHT = 20;

const ScrollBar = ({ children, className, ...props }) => {
  const [hovering, setHovering] = useState(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState(0);
  const [lastScrollThumbPosition, setLastScrollThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseOver = useCallback(() => {
    !hovering && setHovering(true);
  }, [hovering]);

  const handleMouseOut = useCallback(() => {
    !hovering && setHovering(false);
  }, [hovering]);

  const handleMouseUp = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
      }
    },
    [isDragging]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();

        const scrollHostElement = scrollHostRef.current;
        const { scrollHeight, offsetHeight } = scrollHostElement;

        let deltaY = e.deltaY - lastScrollThumbPosition;
        let percentage = deltaY * (scrollHeight / offsetHeight);

        setLastScrollThumbPosition(e.clientY);
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight
          )
        );

        scrollHostElement.scrollTop = Math.min(
          scrollHostElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        );
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const handleScrollThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setLastScrollThumbPosition(e.clientY);
    setIsDragging(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollHostRef) {
      return;
    }

    const scrollHostElement = scrollHostRef.current;
    const { scrollTop, scrollHeight, offsetHeight } = scrollHostElement;

    let newTop =
      (parseInt(scrollTop, 10) / parseInt(scrollHeight, 10)) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
  }, [scrollBoxHeight]);

  const scrollHostRef = useRef();

  useEffect(() => {
    const scrollHostElement = scrollHostRef.current;
    const { clientHeight, scrollHeight } = scrollHostElement;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(
      scrollThumbPercentage * clientHeight,
      SCROLL_BOX_MIN_HEIGHT
    );

    setScrollBoxHeight(scrollThumbHeight);

    scrollHostElement.addEventListener("scroll", handleScroll, true);

    return function cleanup() {
      scrollHostElement.removeEventListener("scroll", handleScroll, true);
    };
  }, [handleScroll]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return function cleanup() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemoup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={"scrollhost-container"}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div ref={scrollHostRef} className={`scrollhost ${className}`} {...props}>
        {children}
      </div>
      <div className={"scroll-bar"} style={{ opacity: hovering ? 1 : 0 }}>
        <div
          className={"scroll-thumb"}
          onMouseDown={handleScrollThumbMouseDown}
          style={{ height: scrollBoxHeight, top: scrollBoxTop }}
        />
      </div>
    </div>
  );
};

export default ScrollBar;
