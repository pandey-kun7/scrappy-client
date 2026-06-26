# hack-scrappy

![hack-scrappy preview](image.png)

hack-scrappy is a small full-stack project for browsing hackathons and related events in a calendar-style interface.

The frontend is built with React + Vite, while a lightweight Express server serves event data from a local JSON file. The UI groups events by registration start date, lets you move across months, and shows event details for the selected day.

## What it does

- fetches live event data from a local API
- shows events inside a monthly calendar view
- highlights how many events fall on each day
- opens a detail panel for the selected date
- displays event info such as:
  - event name
  - location
  - paid/free status
  - registration start and end dates
  - team size
  - skills
  - external event link

## Tech stack

- React 19
- Vite
- Tailwind CSS 4
- Express 5
- Node.js
- Oxlint

## Project structure

```text
hack-scrappy/
├─ src/
│  ├─ App.jsx        # main calendar UI
│  ├─ main.jsx       # React entry point
│  ├─ App.css
│  └─ index.css
├─ index.js          # Express API server
├─ hack.json         # event data served by the API
├─ h2s.json          # local source data snapshot
├─ test1.json        # local source data snapshot
├─ test2.json        # local source data snapshot
├─ test.js           # script used to combine source data into hack.json
├─ package.json
└─ vite.config.js
```

## How data flows

Event data is served from `hack.json`.

The backend reads that file and exposes it through:

```text
GET /api/hacks/live
```

The React app fetches from:

```text
http://localhost:8001/api/hacks/live
```

There are also local source files such as `test1.json`, `test2.json`, and `h2s.json`. The `test.js` script combines data from those files and writes the final output into `hack.json`.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend server

```bash
npm run start
```

This runs the Express server on port `8001`.

### 3. Start the frontend

In a second terminal:

```bash
npm run dev
```

Vite will start the frontend dev server and you can open the app in your browser.

## Available scripts

```bash
npm run dev      # start Vite frontend
npm run build    # create production build
npm run preview  # preview production build
npm run start    # start Express backend with nodemon
npm run lint     # run oxlint
```

## API response shape

The backend returns a JSON response in this format:

```json
{
  "success": true,
  "data": []
}
```

Each event object can include fields like:

- `evnt_name`
- `reg_started`
- `reg_ended`
- `paid`
- `location`
- `site`
- `logo_url`
- `skills`
- `min_team_size`
- `max_team_size`

## Current behavior

- Events are placed on the calendar using `reg_started`
- selecting a day shows all events for that date
- the frontend currently expects the backend to be running locally on port `8001`

## Notes

- This project currently uses local JSON data rather than a database
- `hack.json` is the main file the app reads from at runtime
- if the event dataset changes, regenerate or replace `hack.json` so the API serves the updated records
