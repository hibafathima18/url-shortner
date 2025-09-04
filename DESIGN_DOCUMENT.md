# React URL Shortener - Design Doc

## 1. Architecture

- SPA in React (client only, no backend except logging).
- Components: Layout, RedirectHandler, ShortenerPage, StatsPage.
- Data in localStorage.

## 2. Data

- Stored in localStorage under `urlShortenerData`.
- Each shortCode has longUrl, createdAt, expiresAt, clicks[].
- Custom hook `useUrlStore` to manage.

## 3. Tech

- React (frontend), MUI (UI), React Router (routing).
- Axios (logging API), UUID (shortcodes).

## 4. Routes

- `/` → Shortener page.
- `/stats` → Stats page.
- `/:shortCode` → RedirectHandler.

## 5. Assumptions

- Hardcoded API creds.
- Click analytics basic (referrer + placeholder location).
- Uniqueness only client-side.
- Logging best-effort.
