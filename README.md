# 🎓 Campus Pulse

> **Smart College Notice & Event Hub** — Built for College Hackathons.

Campus Pulse transforms messy, scattered college announcements (long emails, WhatsApp forwards, PDF circulars) into structured, prioritized student intelligence cards with deadline tracking and event calendars.

---

## 🚀 Quick Start (How to Run)

Campus Pulse is ready to run directly.

### 1. Start the Development Server
Open PowerShell or your preferred terminal in this project directory (`campus-pulse`) and run:

```bash
npm run dev
```

*(Note: Node.js has been configured in your user PATH and locally in `.bin/nodejs`)*

### 2. Open in Your Browser
Once Vite starts, open:
```
http://localhost:5173
```

---

## ✨ Features Built in Foundation

### 1. Modern Premium College Dashboard
- **Dark navy and purple aesthetic** (`#070A12`, `#0B0F19`, `#7C3AED`, `#06B6D4`) with glowing accents, subtle glassmorphism cards, and responsive grid layouts.
- Dynamic visual feedback, priority pulses for urgent deadlines, and clean typography.

### 2. Multi-View Sidebar Navigation
- **Dashboard**: High-level overview with statistics cards, Smart Extractor hero, urgent alerts, and recent circulars.
- **All Notices**: Complete searchable & filterable repository with multi-faceted categories, urgency levels, status filters, and sorting.
- **Event Calendar**: Interactive month view (November 2026) with notice indicators on calendar days and date agenda inspector.
- **AI Summary**: Morning intelligence briefing ("Campus Pulse Digest") aggregating action items, departmental roundups (Exams, Placements, Sports, Clubs), and an interactive task checklist.

### 3. Dashboard Statistics Overview
- **Total Notices**: Number of active notices in the system.
- **Urgent Notices**: Circulars requiring immediate action (with glowing rose badge).
- **Upcoming Events**: Milestones scheduled for November 2026 and beyond.
- **Past / Expired**: Archived circulars whose deadlines have passed.
- *Clicking any stat card automatically filters the notice view!*

### 4. Smart Notice Input (Demo Extraction Mode)
- **Large Text Area**: Paste raw circulars, WhatsApp forwards, or emails.
- **1-Click Sample Loaders**: Easily test with pre-built Exam Circular, Placement Drive, and Hackathon templates during hackathon judging.
- **Rule-Based Heuristic Parser**: Client-side pattern-matching extractor that identifies:
  - Title
  - Category (Exams, Placements, Events, Academic, Sports, Clubs, Administrative)
  - Priority (Urgent, High, Medium, Low)
  - Date & Time
  - Venue / Location
  - Immediate student action item
  - Summary & Tags
- **Transparent Demo Mode**: Explicitly labeled as a rule-based demo extractor. No API keys are required for testing.

### 5. Detailed Notice Inspection & Actions
- **Review Modal**: Review and tweak extracted fields before publishing to the dashboard.
- **Details Modal**: View full original circular text, copy formatted digest, or click **Add to Google Calendar** to generate an event link.
- **Pin to Top**: Bookmark critical circulars so they stay at the top of your dashboard.
- **Browser Persistence**: All additions, pins, and deletions are saved to browser `localStorage`.
- **Reset Demo Data**: Easily restore original sample notices anytime from the sidebar.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom navy & purple color themes
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (Key: `campus_pulse_notices_v1`)

---

## 🔮 Extending with Real AI (Phase 2)

The parser is cleanly decoupled in `src/services/extractorService.js`. To connect Google Gemini API:
1. Replace `extractorService.extractNotice` with a call to the Gemini 1.5 Flash structured JSON endpoint.
2. The UI is 100% prepared to accept the exact same structured schema without any layout rewrites.
