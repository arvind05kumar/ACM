import { useState, useEffect } from 'react';

/**
 * Custom React Hook to detect and extract client device, OS, browser, platform, and agent details.
 */
export function useDeviceDetails() {
  const [details, setDetails] = useState({
    browser: 'Unknown',
    device: 'Desktop',
    operatingSystem: 'Unknown',
    platform: 'Unknown',
    userAgent: '',
    timestamp: ''
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const platform = navigator.platform || 'Unknown';
    
    // 1. Detect Browser
    let browser = 'Unknown Browser';
    if (ua.indexOf('Firefox') > -1) {
      browser = 'Mozilla Firefox';
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      browser = 'Samsung Internet';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      browser = 'Opera';
    } else if (ua.indexOf('Trident') > -1) {
      browser = 'Microsoft Internet Explorer';
    } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
      browser = 'Microsoft Edge';
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Google Chrome';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Apple Safari';
    }

    // 2. Detect OS
    let os = 'Unknown OS';
    if (ua.indexOf('Windows NT 10.0') > -1) os = 'Windows 10/11';
    else if (ua.indexOf('Windows NT 6.2') > -1) os = 'Windows 8';
    else if (ua.indexOf('Windows NT 6.1') > -1) os = 'Windows 7';
    else if (ua.indexOf('Macintosh') > -1) os = 'macOS';
    else if (ua.indexOf('iPhone') > -1) os = 'iOS';
    else if (ua.indexOf('iPad') > -1) os = 'iPadOS';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';

    // 3. Detect Device Category
    let device = 'Desktop';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua);
    
    if (isTablet) {
      device = 'Tablet';
    } else if (isMobile) {
      device = 'Mobile';
    }

    // 4. Update state with current details
    setDetails({
      browser,
      device,
      operatingSystem: os,
      platform,
      userAgent: ua,
      timestamp: new Date().toLocaleString('en-US', { timeZoneName: 'short' })
    });
  }, []);

  return details;
}
