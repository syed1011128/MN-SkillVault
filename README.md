# SkillVault

A responsive, dark-themed front end for a Google Drive folder full of tech-skill
playlists. SkillVault doesn't host any lesson content — it reads a small JSON file
that mirrors your Drive folder structure and renders it as a searchable, filterable
course catalog. Drive stays the source of truth; this is just the doorway to it.

## File structure

```
SkillVault/
├── index.html        Home — hero, categories, how-it-works, CTA
├── courses.html       Courses — dynamic grid, search, category filters
├── about.html          About — mission, vision, why it's efficient, admin panel
├── contact.html        Contact — validated contact form + FAQ
│
├── css/
│   ├── style.css        Design tokens, reset, layout, components
│   ├── responsive.css    Breakpoints (1024 / 768 / 520px)
│   └── animations.css    Keyframes + scroll-reveal utilities
│
├── js/
│   ├── app.js            Shared: scroll reveal, back-to-top, toasts, contact form
│   ├── courses.js        Fetches data/courses.json, renders cards + chips
│   ├── search.js          Wires the search box to courses.js
│   └── navbar.js          Mobile menu, scroll shadow, active link
│
├── data/
│   └── courses.json      The single source SkillVault reads from
│
├── assets/
│   ├── images/            (empty — drop screenshots/photos here)
│   ├── icons/              Category SVG icons
│   └── logos/              Dial logo + favicon
│
└── README.md
```

## Connecting your real Google Drive folder

1. In Google Drive, right-click your top-level folder → **Share** → set
   "Anyone with the link" to Viewer (or restrict it, if you'd rather keep it private).
2. Copy the folder's share link.
3. Open `data/courses.json` and replace `driveRoot` with that link.
4. For each playlist, create a subfolder in Drive, share it the same way, and add
   a matching entry to the `courses` array in `courses.json` (title, category,
   description, tags, lesson/hour counts, and the subfolder's `driveLink`).
5. Refresh `courses.html` — no build step, no server, no redeploy required.

The `category` value on each course must match one of the `id`s listed under
`categories` at the top of the file, or it won't show up under that filter chip.

## Running locally

Because the pages fetch `data/courses.json` with `fetch()`, opening `index.html`
directly via `file://` will be blocked by the browser in most cases. Serve the
folder instead:

```bash
# Python 3
python -m http.server 8080

# Node (if you have npx available)
npx serve .
```

Then visit `http://localhost:8080`.

## Notes on the admin panel

The "Admin panel" on the About page is a visual mock, not a working login. This
is a static front end with no backend, so real authentication (checking a
password, issuing a session) needs something like Firebase Auth, a small serverless
function, or your own API sitting behind that same screen. Until then, "admin
access" in practice just means: who can edit the Drive folder, and who can edit
`data/courses.json`.

## Notes on the contact form

`contact.html`'s form validates on the client and simulates a send (see
`js/app.js`) so the flow can be demoed end to end, but nothing is actually
transmitted yet. Point the form at a real endpoint (Formspree, a Cloud Function,
your own API) when you're ready to receive real messages.

## Design notes

- Dark theme throughout: near-black base (`#0B0E14`) with a gold (`#E3B341`) and
  teal (`#2DD4BF`) accent pair, referencing a vault dial / lock motif.
- Display type is Space Grotesk, body text is Inter, and tags/metadata use
  JetBrains Mono — all loaded from Google Fonts.
- The signature visual is the rotating "vault dial" mark in the hero and the
  perforated "reel" edge on each course card, echoing the idea of a playlist as
  a tape you load and play.
- Respects `prefers-reduced-motion` and includes visible keyboard focus states,
  a skip link, and `aria-live` status messaging on the contact form.
