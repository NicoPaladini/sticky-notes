import type { Note, NoteColor } from './types'

export const NOTE_COLORS = [
  'yellow',
  'pink',
  'blue',
  'green',
] as const satisfies readonly NoteColor[]
export const MAX_NOTES = 100
export const NOTES_STORAGE_KEY = 'sticky-notes-v1'

export const DEFAULT_NOTE_WIDTH = 240
export const DEFAULT_NOTE_HEIGHT = 190
export const MIN_NOTE_WIDTH = 180
export const MIN_NOTE_HEIGHT = 150
export const TOOLBAR_HEIGHT = 74

export const STARTER_NOTES: Note[] = [
  {
    id: 'welcome',
    text: 'Welcome!\n\nDrag this top bar to move me.',
    color: 'yellow',
    x: 96,
    y: 100,
    width: 250,
    height: 220,
    zIndex: 1,
  },
  {
    id: 'tips',
    text: 'Quick tips\n\n• Double-click the board to add a note\n• Drag the corner to resize\n• Notes save automatically',
    color: 'pink',
    x: 390,
    y: 190,
    width: 280,
    height: 230,
    zIndex: 2,
  },
]
