# 📅 Interactive Calendar with Notes & Dynamic Theming

An interactive, wall-calendar inspired React component featuring date range selection, notes management, and dynamic theming.

This project focuses on **frontend engineering excellence**, including performance optimization, responsive design, and user experience.

---

# 🌐 Live Demo

https://interactive-calendar-ivory.vercel.app/

---

## Project Objective

This project was built as part of a frontend engineering challenge to transform a static calendar design into a **fully functional, responsive, and interactive web component**.

---

## ✨ Features

### Calendar UI

- Wall calendar inspired layout with hero image
- Clean visual hierarchy between image and date grid
- Smooth month navigation with animations

### Date Range Selection

- Select start and end dates
- Visual highlight for:
  - Start date
  - End date
  - Range in between

- Supports reverse selection

### Notes System

- Add notes for:
  - Single date
  - Date range
  - Entire month

- Toggle between date-based and monthly notes
- Pin important notes
- Clear notes option
- Data persists using localStorage

### Dynamic Theming

- Extracts dominant color from images using Canvas API
- Applies theme dynamically to UI elements
- Cached results to avoid repeated computation
- Ensures contrast for accessibility

---

## Mobile Experience

- 👆 Tap → select date
- ✋ Long press → enable range selection
- 👉 Swipe left/right → change month
- Larger touch targets for better usability

---

## Desktop Experience

- Click → select date
- Double click → range selection
- Smooth animations using Framer Motion
- Balanced layout inspired by wall calendars

---

##  Performance Optimizations

- Image preloading for faster switching
- Cached color extraction (avoids recalculation)
- Debounced note saving (smooth typing experience)
- Memoized components to reduce re-renders

---

## Tech Stack

- React (Vite)
- Tailwind CSS
- date-fns
- Framer Motion
- localStorage

---

## 📂 Project Structure

```
src/
 ├── components/
 │   ├── Calendar.jsx
 │   ├── CalendarGrid.jsx
 │   ├── DayCell.jsx
 │   ├── HeaderImage.jsx
 │   ├── NotesPanel.jsx
 │
 ├── hooks/
 ├── utils/
 ├── data/
 ├── constants/
```

---

## How to Run Locally

### 1️. Clone the repository

```
git clone https://github.com/SABARITHAN-P/Interactive-Calendar.git
```

### 2️. Navigate to project

```
cd Interactive-Calendar
```

### 3️. Install dependencies

```
npm install
```

### 4️. Start development server

```
npm run dev
```

### 5️. Open in browser

```
http://localhost:5173
```

---

## Build for Production

```
npm run build
```

Preview build:

```
npm run preview
```

---

## Live Demo

👉 https://interactive-calendar-ivory.vercel.app

---

## State Management

- Managed using React hooks (useState, useEffect, useRef)
- Derived state for date range and selection logic
- localStorage used for persistence layer
- Debounced updates to optimize performance

---

## 🧠 Key Engineering Decisions

- Used localStorage instead of backend (as per requirement)
- Implemented long press for mobile (since double-click doesn’t work)
- Cached image colors to improve performance
- Used debounce for better typing performance
- Designed with mobile-first responsive approach

---

## ⚠️ Limitations

- Data is stored locally (no cross-device sync)
- No backend integration (intentionally avoided per challenge scope)

---

## 👨‍💻 Author

Sabarithan P

---

## ⭐ Final Note

This project demonstrates:

- Strong React fundamentals
- Clean component architecture
- UI/UX attention to detail
- Performance optimization techniques
