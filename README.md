# Our Little Universe ♡

A responsive romantic couple website built with React, Vite, Tailwind CSS, and Lucide icons. Your uploaded photos are bundled locally in `src/assets`, so the gallery does not depend on third-party image hosting.

## Run locally

1. Install Node.js (LTS).
2. Open a terminal in this project folder.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL printed by Vite.
5. Run `npm run build` to create a production build.

## Personalize it

- **Photos and captions:** edit the `photos` array in `src/App.jsx`. Replace files in `src/assets` as needed.
- **Timeline:** edit the `milestones` array in `src/App.jsx`.
- **Love letter:** edit the text inside the `letter-paper` section in `src/App.jsx`.
- **Days-together counter:** use the date picker on the page. The chosen date is saved in the browser's local storage.
- **Music:** the music button streams the sample track configured in the `<audio>` element in `src/App.jsx`. Replace its `src` with a song URL you have permission to use. Browsers require a user click before audio can start.

The layout is responsive for phones, tablets, and desktop screens. No backend is required.
