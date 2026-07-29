# ACM Event Attendance Portal

A production-ready, high-performance, and visually stunning Event Attendance Portal built for ACM. Inspired by Apple's clean design aesthetics, Stripe's layouts, and Linear's interface mechanics, this portal features a multi-step Instagram follow gate and instant database syncing with Google Sheets.

---

## 🛠 Tech Stack

- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS v4 (CSS-First Theme Config)
- **Animations**: Framer Motion
- **Icons**: Lucide React Icons
- **Database Backend**: Google Sheets API via Google Apps Script Web App
- **Hosting**: Vercel

---

## 📂 Folder Structure

```
ACM/
├── dist/                # Production-ready compile output
├── public/              # Static public resources (icons, assets)
├── src/
│   ├── assets/          # Logos, branding media files
│   ├── components/      # Modular layout components
│   │   ├── ui/          # Atomic UI elements
│   │   │   ├── Button.jsx  # Animated framer button
│   │   │   ├── Card.jsx    # Glassmorphic responsive cards
│   │   │   ├── Input.jsx   # Form input with inline validation
│   │   │   └── Toast.jsx   # Self-dismissing toast notifications
│   │   ├── Header.jsx   # Sticky glassmorphic navbar with logo grids
│   │   ├── Footer.jsx   # Minimal organizer branding footer
│   │   ├── Hero.jsx     # Hero section with large typography & CTAs
│   │   ├── EventCard.jsx # Meta details card (Date, venue, etc.)
│   │   ├── SpeakerSection.jsx # Keynote profile grid (with avatar fallbacks)
│   │   ├── InstagramGate.jsx  # Verification flow manager (two-step timers)
│   │   ├── AttendanceForm.jsx # Input handler with metadata collection
│   │   ├── LoadingScreen.jsx  # Pre-loading progress screen
│   │   └── SuccessScreen.jsx  # Digital entry pass receipt
│   ├── config/
│   │   └── config.js    # Single point of configuration for the event
│   ├── hooks/
│   │   └── useDeviceDetails.js # Hidden client metadata collector
│   ├── utils/
│   │   └── validation.js       # Field verification helpers
│   ├── App.css          # Styling resets
│   ├── App.jsx          # Screen orchestrator & virtual state machine
│   ├── index.css        # Main stylesheet (Tailwind v4 imports + custom grid)
│   └── main.jsx         # App entry point
├── apps-script.js       # Google Apps Script API backend code
├── package.json         # Package configuration
├── vite.config.js       # Vite + Tailwind compiler settings
└── README.md            # Project documentation (this file)
```

---

## 🚀 Installation & Running Locally

### 1. Prerequisite
Ensure you have **Node.js (v18.x or later)** and **npm** installed.

### 2. Install Dependencies
Run the following command inside the project root:
```bash
npm install
```

### 3. Start Development Server
Launch the local server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build Production Bundle
To build for production deploy:
```bash
npm run build
```

---

## 📊 Google Sheets Integration Guide

The application communicates with a Google Sheet through a deployed Apps Script Web App. Follow these steps to set up your backend.

### 1. Create a Google Sheet
- Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
- Give it a name (e.g., `ACM DevSummit Attendance`).
- Leave the columns empty; the backend script will automatically initialize the headers on the first submission.

### 2. Add the Apps Script Code
- Click **Extensions > Apps Script** in the spreadsheet menu.
- Delete any code in the editor and replace it with the contents of the `apps-script.js` file located in the root of this project.
- Click the disk icon to save.

### 3. Deploy as a Web App
- Click **Deploy > New deployment** in the top right.
- Click the gear icon next to "Select type" and select **Web app**.
- Configure the options:
  - **Description**: `ACM Attendance API`
  - **Execute as**: `Me (your email address)`
  - **Who has access**: `Anyone` (This is required so your portal can send submissions without authorization screens).
- Click **Deploy**.

### 4. Authorize Permissions
- Click **Authorize Access** in the popup that appears.
- Select your Google account.
- Click **Advanced** (on the warning screen stating "Google hasn't verified this app") and click **Go to Untitled project (unsafe)**.
- Review permissions and click **Allow**.

### 5. Link Web App to React
- Copy the **Web App URL** provided under the successful deployment details. It should look like this:
  `https://script.google.com/macros/s/AKfycb.../exec`
- Open `src/config/config.js` inside the project editor.
- Update the `googleAppsScriptUrl` field with your copied URL:
  ```javascript
  googleAppsScriptUrl: "https://script.google.com/macros/s/YOUR_ACTUAL_DEPLAYED_URL/exec",
  ```

---

## ⚡ Duplicate Roll Number Check Logic
The Apps Script locks the sheet block using Google's `LockService` during POST execution. It searches Column C (the Roll Number column) for any case-insensitive match against the submitting student's Roll Number:
- If a match is found, the submission is aborted, and a JSON block `{ status: "duplicate", message: "..." }` is returned.
- If unique, it writes a new row containing the timestamp, student inputs, and hidden browser parameters.

---

## ☁️ Vercel Hosting Deployment Guide

### Option 1: Vercel CLI (Fastest)
- Install Vercel globally: `npm install -g vercel`
- Run `vercel` in the project directory.
- Follow prompts to link your account and select default options.

### Option 2: Github Link (Recommended)
- Push this folder to a GitHub repository.
- Go to the [Vercel Dashboard](https://vercel.com) and click **Add New > Project**.
- Import your repository.
- Under **Build & Development Settings**, Vercel will automatically detect Vite and preset `npm run build` as build command.
- Click **Deploy**.

---

## 🧪 Testing Checklist

- [ ] **Pre-loader**: Verify progress bar increments smoothly and fades out.
- [ ] **Responsive check**: Verify layouts look perfect on Mobile (iPhone size), Tablet (iPad size), and Desktop.
- [ ] **Instagram Gate Bypasses**: Verify that Button 2 remains disabled until Button 1 is clicked and Card 1 countdown completes. Verify "Continue" remains disabled until Step 2 is fully complete.
- [ ] **Empty Validation**: Try submitting empty fields to check for red inline validation warnings.
- [ ] **Email Format**: Enter an invalid email address (e.g. `test@test`) to test error triggers.
- [ ] **Duplicate Prevention**: Submit the form once. Then try re-opening the form and submitting the exact same Roll Number to confirm the Toast warning "You have already marked your attendance" appears.
- [ ] **Data Integrity**: Verify that headers are successfully formatted in bold grey on the sheet, and that hidden fields (Browser name, OS, device category, user agent) are successfully logged.

---

## 🔍 Troubleshooting Guide

#### ❌ Error: "Apps Script URL is not configured..."
*   **Cause**: You are attempting to register attendance using the default placeholder URL inside `config.js`.
*   **Fix**: Follow the [Sheets Integration Guide](#-google-sheets-integration-guide) to deploy your Apps Script and paste the output URL in `src/config/config.js`.

#### ❌ Form loading spins indefinitely / CORS Blocks
*   **Cause**: The Apps Script was not deployed with "Who has access: Anyone" or was deployed with "Execute as: User accessing the web app".
*   **Fix**: Create a "New deployment" in Apps Script, set "Who has access" to "Anyone", and redeploy. Copy the new URL into `config.js`.

#### ❌ The follow gate counts down but button remains disabled
*   **Cause**: You clicked back to the browser tab too quickly and interrupted browser focus states, or javascript execution was throttled by browser power management.
*   **Fix**: Keep the tab active. The timer is purely client-side and completes automatically in 15 seconds.

---

*Designed and Developed by **Vision Forge** in collaboration with **ACM Student Chapter**.*
