/**
 * ACM Event Attendance Portal Configuration
 * 
 * Edit these values to customize the portal for your event.
 * Only these values should need editing. Everything else works automatically.
 */
export const CONFIG = {
  // Event Details
  eventName: "ACM DevSummit 2026",
  eventTagline: "Building the Next Generation of Open Source & AI Tech",
  eventDate: "Tuesday, 4th August, 2026",
  eventTime: "10:00 AM - 03:00 PM",
  eventVenue: "Main Auditorium, CGC Landran",
  collegeName: "CGC Landran",
  organizerName: "ACM Student Chapter",
  poweredByName: "Vision Forge",

  // Speakers Configuration (Used in the Speaker section)
  speakers: [
    {
      name: "Dr. Sarah Jenkins",
      designation: "Principal AI Scientist",
      company: "Google DeepMind",
      description: "Leading research on agentic systems and multi-modal models. Former MIT AI Lab researcher.",
      avatar: "" // Empty will fallback to elegant SVG initials avatar
    },
    {
      name: "Alex Rivera",
      designation: "Developer Advocate",
      company: "Vercel",
      description: "Spearheading serverless frontend architecture and developer experience tools worldwide.",
      avatar: "" // Fallback
    },
    {
      name: "Elena Rostova",
      designation: "Senior Software Architect",
      company: "Linear",
      description: "Specializing in high-performance web applications, collaborative editors, and UI/UX synchronization.",
      avatar: "" // Fallback
    }
  ],

  // Instagram Follow Gate URLs
  instagramPage1: {
    username: "@acm_cec",
    url: "https://www.instagram.com/acm_cec/", // Page 1 URL
    countdownSeconds: 13 // Increased by 10 seconds total
  },
  instagramPage2: {
    username: "@visionforge.labs",
    url: "https://www.instagram.com/visionforge.labs/", // Page 2 URL
    countdownSeconds: 13 // Increased by 10 seconds total
  },

  // Google Sheet API Endpoint URL
  // Replace this with your SheetMonkey.io / SheetDB.io / Webhook URL to store data in Google Sheets without Apps Script code!
  googleSheetEndpoint: "https://sheetdb.io/api/v1/mk5g8gm84q3sr",
  googleAppsScriptUrl: "", // Legacy fallback

  // Image Placeholders (If left empty, code will render premium default SVGs)
  eventLogo: "",      // Main event branding logo
  logo1: "/acm_logo.png",          // Partner Logo 1 (ACM Logo)
  logo2: "/adyant_logo.png",          // Partner Logo 2 (CEC Logo)
  logo3: "/vision_forge_logo.png" // Partner Logo 3 (Vision Forge Logo)
};
