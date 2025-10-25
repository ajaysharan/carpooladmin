// ScrollWrapper.js
import React, { useRef, useEffect } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css'; // Import CSS

const ScrollWrapper = ({ children, options = {}, style = {}, className = '' }) => {
  const containerRef = useRef(null);
  const ps = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      ps.current = new PerfectScrollbar(containerRef.current, options);
    }

    return () => {
      if (ps.current) {
        ps.current.destroy();
        ps.current = null;
      }
    };
  }, [options]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', ...style }}
      className={className}
    >
      {children}
    </div>
  );
};

export default ScrollWrapper;
