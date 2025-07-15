import React, { useEffect, useRef } from 'react';

/**
 * PageWrapper - Wrap individual pages with this component to force scroll to top
 * This is a more direct approach at the component level
 */
const PageWrapper = ({ children }) => {
  const pageRef = useRef(null);
  
  useEffect(() => {
    // Force scroll to top on mount
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force scroll on the container itself
    if (pageRef.current) {
      pageRef.current.scrollTop = 0;
      
      // Find any scrollable parents and reset them too
      let parent = pageRef.current.parentElement;
      while (parent) {
        if (parent.scrollHeight > parent.clientHeight) {
          parent.scrollTop = 0;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

  return (
    <div ref={pageRef} className="page-wrapper w-full">
      {children}
    </div>
  );
};

export default PageWrapper; 