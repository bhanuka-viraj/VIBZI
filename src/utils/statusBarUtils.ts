import {StatusBarStyle, Image, Platform} from 'react-native';

/**
 * Determines if a color is light or dark based on YIQ formula
 * @param backgroundColor Background color in hex format (e.g., '#FFFFFF')
 */
export const getStatusBarStyle = (backgroundColor: string): StatusBarStyle => {
  // Remove the hash if it exists
  const hex = backgroundColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 2), 16);
  const b = parseInt(hex.substring(4, 2), 16);

  // Calculate relative luminance using YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return light status bar for dark backgrounds and vice versa
  return yiq >= 128 ? 'dark-content' : 'light-content';
};

// Predefined status bar styles for common scenarios
export const StatusBarStyles = {
  light: 'dark-content' as StatusBarStyle,

  dark: 'light-content' as StatusBarStyle,

  default: 'light-content' as StatusBarStyle,
};

// Add gradient overlay to ensure status bar is readable
export const getStatusBarGradient = () => {
  if (Platform.OS === 'ios') {
    return ['rgba(0,0,0,0.5)', 'transparent'];
  }
  return ['rgba(0,0,0,0.3)', 'transparent'];
};
