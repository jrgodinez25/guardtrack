# GuardTrack — Security Guard Tracking & Monitoring Prototype

GuardTrack is a browser-based demonstration dashboard for security agency dispatchers. It includes a Leaflet deployment map, guard directory, status filters, activity feed, simulated patrol controls, checkpoint logging, and SOS alert workflow.

> **Safety notice:** This is a prototype. GPS positions, patrols, checkpoint scans, and SOS actions are simulated in the browser. It does not track real people or contact emergency services. Do not use it for operational dispatch or life-safety decisions.

## Files

- `index.html` — application shell and simulator dialog
- `css/styles.css` — responsive dashboard styles
- `js/data.js` — seeded site data
- `js/map.js` — Leaflet map and marker rendering
- `js/app.js` — UI state, simulation, activity feed, and local persistence

## Run locally

ES modules require an HTTP server. From the repository root:

```bash
python -m http.server 8080
```

Then open http://localhost:8080. An internet connection is required for Tailwind, Leaflet, Google Fonts, and OpenStreetMap tiles. No build step or API key is required.

## Features

- Status KPIs and directory search/filtering
- Map markers for active, idle, alert, and offline guards
- Simulated patrol start/end and movement
- Simulated checkpoint check-in and emergency SOS
- Activity feed, reset control, and browser localStorage persistence
- Responsive layout for desktop and mobile

## GitHub Pages

Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. After GitHub Pages finishes publishing, the app should be available at `https://jrgodinez25.github.io/guardtrack/`.

## Production considerations

A real deployment needs authenticated users, role-based authorization, a secure backend/database, real device enrollment and GPS permission, validated QR/NFC tokens, audit logging, escalation rules, privacy notices and retention controls, monitoring, backups, security testing, and compliance with applicable Philippine privacy and labor requirements. Browser localStorage is not suitable for sharing sensitive live operations across dispatchers.
