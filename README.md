# 🎟️ CampusVibe - Campus & National Events Hub

[![React](https://img.shields.io/badge/React-19.3.1-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CampusVibe** is a modern, high-performance web platform designed for discovering and registering for campus hackathons, live concerts, technical bootcamps, cultural festivals, and inter-university sports tournaments.

---

## 🌟 Key Features

### 🔐 1. Client-Side Cryptographic Authentication
* **Web Crypto API:** Password hashing with **PBKDF2-SHA256** using unique cryptographic salts and 150,000 iterations via `window.crypto.subtle`.
* **Account Modes:** Seamless switching between **Sign In**, **Create Account**, and **Password Reset**.
* **Password Usability & Safety:**
  * Password visibility show/hide toggle (`Eye` / `EyeOff`).
  * Live 4-tier password strength meter (Weak, Fair, Good, Strong).
  * Confirm Password matching indicator for zero mistypes.
  * Local account password recovery ("Forgot password?").
* **Accessible Modal Design:** Integrated header navigation, <kbd>Esc</kbd> key dismissal, and responsive viewport-height adaptation without clipping.

### 🎫 2. Account-Scoped Digital Event Passes
* **Strict Per-Account Isolation:** Passes are saved and scoped strictly to the signed-in account (`currentUser.email`).
* **Hidden When Signed Out:** "My Passes" is visible only when signed in, ensuring privacy across multiple users.
* **Instant Verification:** Unique Pass IDs (`KEXP-XXXXXX`) generated for each registration.
* **Pass Management:**
  * One-click Pass ID copying to clipboard.
  * Print-ready pass confirmation dialog.
  * Cancel / delete individual passes or clear passes for the active account.

### 🔍 3. Event Discovery, Filters & Sorting
* **Instant Search:** Search across event titles, venues, organizers, short descriptions, and categories.
* **Category Pills:** Filter by *Tech & Hackathons*, *Music & Concerts*, *Workshops*, *Cultural*, and *Sports*.
* **Price Filter:** Quick toggle between *All*, *Free Admission*, and *Paid*.
* **Smart Sorting:**
  * 🕒 Upcoming Soonest
  * ⚡ Filling Fast (Least seats left)
  * 🎁 Free Admission First
  * 🔤 Alphabetical (A – Z)

### ⏱️ 4. Dynamic Live Status & Countdowns
* **Live Countdown Badges:** Real-time ticking badge displaying `Days : Hours : Minutes : Seconds` until event commencement.
* **Live Now Badges:** Automatic live event detection with pulsing status indicators.
* **Dynamic Seat Allocation:** Remaining seat counts update dynamically as users register for events, complete with "Filling Fast" and "Sold Out" states.

### 🔖 5. Bookmarks & Event Wishlist
* Save favorite events with a single click.
* Filter view to display only saved/bookmarked events.

### 🌓 6. Dark / Light Theme & Responsive Layout
* Smooth theme toggling with Tailwind CSS variable-based palette.
* Fully responsive layout optimized for mobile screens, tablets, and desktop displays.
* Interactive avatar dropdown menu with user initials and sign-out.

---

## 📂 Project Structure

```text
k-explore-events/
├── public/
│   ├── favicon.svg          # App brand icon
│   └── icons.svg            # SVG sprite definitions
├── src/
│   ├── assets/              # Static media assets & images
│   ├── components/
│   │   ├── AuthModal.jsx        # Login, registration & password reset modal
│   │   ├── CountdownBadge.jsx   # Live countdown timer badge
│   │   ├── EventCard.jsx        # Event showcase card with badges & actions
│   │   ├── EventModal.jsx       # Event details & registration dialog
│   │   ├── Footer.jsx           # Platform footer & terms trigger
│   │   ├── Hero.jsx             # Hero section with stats & trending tags
│   │   ├── MyRegistrations.jsx  # Slide-over drawer for account passes
│   │   ├── Navbar.jsx           # Sticky navigation, theme toggle & user menu
│   │   └── TermsModal.jsx       # Terms of service & community guidelines
│   ├── data/
│   │   └── events.js            # Curated catalog of campus & national events
│   ├── utils/
│   │   └── localAuth.js         # PBKDF2 hashing & local storage auth management
│   ├── App.jsx                  # Main application state & orchestration
│   ├── index.css                # Tailwind CSS v4 configuration & theme tokens
│   └── main.jsx                 # Application entry point
├── index.html                   # HTML document template
├── package.json                 # Project dependencies & scripts
└── vite.config.js               # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
* `npm` (bundled with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd k-explore-events
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory for production. |
| `npm run preview` | Starts a local static web server to preview the production build. |
| `npm run lint` | Runs ESLint across all codebase files to ensure code quality. |

---

## 🔒 Security & Local Data Privacy

* **Zero Plaintext Passwords:** Passwords are never stored in plaintext. They are salted with 16 bytes of cryptographically secure random values and hashed with 150,000 PBKDF2 iterations using SHA-256.
* **Browser Sandbox:** Accounts and generated event passes are stored locally in the browser's `localStorage`. No external tracking or server calls are required.
* **Multi-Account Safety:** Passes are partitioned by the normalized user email address, preventing data leakage between different profiles on the same device.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
