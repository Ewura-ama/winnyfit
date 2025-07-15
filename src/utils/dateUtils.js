/**
 * Format a date string to a more readable format
 * @param {string} dateString - A date string in ISO format (YYYY-MM-DD)
 * @returns {string} Formatted date string (e.g., "Mon, Jan 15, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Not scheduled';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a time string to a more readable format
 * @param {string} timeString - A time string in HH:MM:SS format
 * @returns {string} Formatted time string (e.g., "3:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'Not scheduled';

  try {
    // Handle both HH:MM:SS and HH:MM formats
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Get a formatted date/time string from a date object
 * @param {Date} date - A JavaScript Date object
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date/time:', error);
    return '';
  }
};

/**
 * Check if a date is today
 * @param {string} dateString - A date string in ISO format (YYYY-MM-DD)
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Format a date string as a relative time (e.g., "2 days ago")
 * @param {string} dateString - A date string in ISO format
 * @returns {string} Relative time string
 */
export const getRelativeTimeString = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    // Format as a date
    return formatDate(dateString);
  } catch (error) {
    console.error('Error generating relative time:', error);
    return dateString;
  }
}; 