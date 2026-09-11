# Sticky Notes

A small desktop-first board for creating and organizing sticky notes.

The minimum supported browser window size is 1024 × 768 pixels. A message asks the user to enlarge the window when either dimension is below this requirement.

## Run locally

Node.js 20 or newer is recommended.

```bash
npm install
npm run dev
```

Open the address shown by Vite. Use `npm run build` to create a production build and `npm run preview` to preview it.

## How to use

- Choose a color and press **New note**. Click and drag on the board to set the note position and size. A simple click creates a note with the default size.
- Double-click an empty place to quickly create a default note.
- Drag the dotted bar to move a note. Drag the folded bottom-right corner to resize it.
- Type directly into a note. Click any note to move it in front of the others.
- Move any part of a note over the trash area and drop it. Confirm the dialog to remove it. Notes are saved in local storage automatically.
- A board can contain up to 100 notes. This limit avoids performance issues caused by rendering and saving too many notes at once. Delete an existing note before creating another when the limit is reached.

## Architecture

The application is split into a small state layer and focused UI components. `useNotes` owns the note collection and all create, update, stacking, delete, and local-storage operations. `App` manages board-only interaction state, such as drawing a new note and detecting the trash zone. `Toolbar` and `StickyNote` receive typed data and callbacks, which keeps the components independent from storage details.

Pointer Events power creating, moving, and resizing, so one interaction model works in all supported browsers. Pointer capture keeps a drag stable even if the pointer moves quickly outside its handle. Note positions are stored relative to the board, constrained to its current bounds, and rendered absolutely for direct manipulation without a third-party component library.
