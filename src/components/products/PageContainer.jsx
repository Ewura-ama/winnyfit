import React, { useLayoutEffect, useRef, useEffect } from 'react';

/**
 * A container component that ensures each page starts at the top
 * This component forces scroll reset when children change
 */
const PageContainer = ({ children, className = "" }) => {
  const containerRef = useRef(null);
  
  // Force scroll reset on mount and when children change
  useLayoutEffect(() => {
    // Reset scroll in multiple ways
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Try to scroll the container into view
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    
    // Set a sequence of scroll resets with increasing delays
    const delays = [10, 50, 100, 200, 300];
    const timeoutIds = delays.map(delay => 
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Try container scroll into view again after delay
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, delay)
    );
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [children]);
  
  // Base classes for consistent page container styling
  const baseClasses = "min-h-screen pt-20 pb-12 px-4";
  
  return (
    <main 
      ref={containerRef}
      
      className={`${baseClasses} ${className}`}
      tabIndex="-1" // Makes the element focusable for scrollIntoView
    >
      {children}
    </main>
  );
};

export default PageContainer; 