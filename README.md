# GuardTrack — Security Guard Tracking & Monitoring Prototype

## Authentication demo (static hosting)

- Sign-in page: `login.html`
- Admin demo: `admin@guardtrack.com` / `admin123`
- Guard demo: `guard.juan@guardtrack.com` / `guard123`
- Admins are routed to `index.html`; guards are routed to `guard.html`.
- The browser remembers the session with localStorage when **Remember me** is checked, or sessionStorage for a tab-only session.
- Log out from the profile menu to clear both session keys.

The demo account list is initialized in localStorage under `guardtrack.demoAccounts` so the sample accounts can be tested without a backend. The account passwords and session data are browser-side demonstration data, not secure credential storage.

## Important security limitation

**This is client-side demo RBAC, not production security.** GitHub Pages only serves static files. A user can inspect or modify JavaScript and localStorage, so these checks cannot securely protect privileged data or prove a user's identity. Do not use real credentials or sensitive operational information with this demo.

For production, use a trusted identity provider or backend authentication, secure server-side role checks for every protected API/resource, HTTPS, short-lived sessions, secure cookie handling where applicable, password hashing, audit logs, rate limiting, and account recovery/MFA. Do not rely on a role selector or browser storage to authorize access.

## Features

- Admin command dashboard with map, KPIs, directory, and alerts
- Guard-only mobile console for simulated patrols, checkpoint check-ins, and SOS
- Login, Remember Me, profile initials/role, and logout
- Local-only simulated GPS and event data

## Run locally

Serve the root folder with `python -m http.server 8080` and visit `http://localhost:8080/login.html`. The app needs internet access for Tailwind, Leaflet, fonts, and map tiles.

## GitHub Pages

Select `main` and `/(root)` in **Settings → Pages**. The site should be available at `https://jrgodinez25.github.io/guardtrack/login.html`.
