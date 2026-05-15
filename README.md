# SkateXP

SkateXP is a simple skateboarding progression tracker built with HTML, CSS, and JavaScript.

## Features

- Daily skate session logging with streak tracking
- XP system with progressive leveling
- Trick tracker with save/delete and trick-leveling
- Badge system for streak consistency and trick mastery
- Local data persistence using browser `localStorage`

## Pages

- `index.html` — main dashboard for logging sessions, XP, tricks, and badges
- `login.html` — simple username login flow
- `badges.html` — badge information and progress overview

## How to run

1. Open `index.html` in a browser after logging in via `login.html`.
2. Enter your username and press `DROP IN`.
3. Track sessions, add tricks, and earn XP and badges.
4. Keep your skatestreak!, you have 3 days to get it up.

## Notes

- The app stores progress locally in the browser using `localStorage`.
- Tricks are stored per user with separate keys for XP, streaks, and badge progress.
- Refreshing the page keeps your current session data intact.