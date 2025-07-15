/**
 * Helper function to navigate between pages
 * This is a utility to centralize navigation behavior
 * ScrollToTop component now handles scroll behavior consistently
 */
export const navigateTo = (navigate, path, options = {}) => {
  // Navigate to the requested page
  // The ScrollToTop component will handle scrolling to top
  navigate(path, options);
}; 