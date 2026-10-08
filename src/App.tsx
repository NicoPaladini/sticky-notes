import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import './App.css'
import { StickyNote } from './components/StickyNote'
import { Toolbar } from './components/Toolbar'
import { TrashIcon } from './components/Icons'
import {
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_WIDTH,
  MAX_NOTES,
  MIN_NOTE_HEIGHT,
  MIN_NOTE_WIDTH,
  TOOLBAR_HEIGHT,
} from './constants'
import { useNotes } from './hooks/useNotes'
import type { NoteColor, Rect } from './types'

type Point = { x: number; y: number }

function App() {
  const boardRef = useRef<HTMLElement>(null)
  const trashRef = useRef<HTMLDivElement>(null)
  const createStart = useRef<Point | null>(null)
  const { notes, addNote, updateNote, bringToFront, removeNote, clearNotes } =
    useNotes()
  const [color, setColor] = useState<NoteColor>('yellow')
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState<Rect | null>(null)
  const [isTrashActive, setIsTrashActive] = useState(false)
  const [boardSize, setBoardSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - TOOLBAR_HEIGHT,
  })

  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current)
        setBoardSize({
          width: boardRef.current.clientWidth,
          height: boardRef.current.clientHeight,
        })
    }
    updateSize()
    const observer = new ResizeObserver(updateSize)
    if (boardRef.current) observer.observe(boardRef.current)
    return () => observer.disconnect()
  }, [])

  const boardPoint = (event: ReactPointerEvent<HTMLElement>): Point => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(event.clientX - bounds.left, boardSize.width)),
      y: Math.max(0, Math.min(event.clientY - bounds.top, boardSize.height)),
    }
  }
  const startCreating = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isCreating || event.target !== event.currentTarget) return
    const point = boardPoint(event)
    createStart.current = point
    setDraft({ ...point, width: 0, height: 0 })
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const drawDraft = (event: ReactPointerEvent<HTMLElement>) => {
    if (!createStart.current) return
    const point = boardPoint(event)
    const start = createStart.current
    setDraft({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    })
  }
  const finishCreating = (event: ReactPointerEvent<HTMLElement>) => {
    if (!createStart.current) return
    const start = createStart.current
    const point = boardPoint(event)
    const width = Math.abs(point.x - start.x)
    const height = Math.abs(point.y - start.y)
    const clicked = width < MIN_NOTE_WIDTH || height < MIN_NOTE_HEIGHT
    addNote(
      clicked
        ? {
            x: Math.max(
              0,
              Math.min(start.x, boardSize.width - DEFAULT_NOTE_WIDTH),
            ),
            y: Math.max(
              0,
              Math.min(start.y, boardSize.height - DEFAULT_NOTE_HEIGHT),
            ),
            width: DEFAULT_NOTE_WIDTH,
            height: DEFAULT_NOTE_HEIGHT,
          }
        : {
            x: Math.min(start.x, point.x),
            y: Math.min(start.y, point.y),
            width,
            height,
          },
      color,
    )
    createStart.current = null
    setDraft(null)
    setIsCreating(false)
  }
  const addOnDoubleClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || isCreating) return
    if (notes.length >= MAX_NOTES) {
      window.alert(
        `You can create up to ${MAX_NOTES} notes. Delete one before adding another.`,
      )
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    addNote(
      {
        x: Math.max(
          0,
          Math.min(
            event.clientX - bounds.left,
            boardSize.width - DEFAULT_NOTE_WIDTH,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            event.clientY - bounds.top,
            boardSize.height - DEFAULT_NOTE_HEIGHT,
          ),
        ),
        width: DEFAULT_NOTE_WIDTH,
        height: DEFAULT_NOTE_HEIGHT,
      },
      color,
    )
  }
  const isOverTrash = (rect: Rect) => {
    const trashBounds = trashRef.current?.getBoundingClientRect()
    const boardBounds = boardRef.current?.getBoundingClientRect()
    if (!trashBounds || !boardBounds) return false

    const noteLeft = boardBounds.left + rect.x
    const noteTop = boardBounds.top + rect.y
    const noteRight = noteLeft + rect.width
    const noteBottom = noteTop + rect.height

    return (
      noteRight >= trashBounds.left &&
      noteLeft <= trashBounds.right &&
      noteBottom >= trashBounds.top &&
      noteTop <= trashBounds.bottom
    )
  }
  const confirmClear = () => {
    if (notes.length > 0 && window.confirm('Remove all notes?')) clearNotes()
  }

  return (
    <main className="app-shell">
      <div className="resolution-warning" role="alert">
        <div className="resolution-warning-card">
          <span className="resolution-icon" aria-hidden="true">
            ↗
          </span>
          <h1>This window is too small</h1>
          <p>
            Sticky Notes requires a minimum window size of 1024 × 768 pixels.
          </p>
          <p>Please enlarge your browser window to continue.</p>
        </div>
      </div>
      <Toolbar
        color={color}
        isCreating={isCreating}
        noteCount={notes.length}
        onColorChange={setColor}
        onCreate={() => {
          setIsCreating((value) => !value)
          setDraft(null)
          createStart.current = null
        }}
        onClear={confirmClear}
      />
      <section
        ref={boardRef}
        className={`board${isCreating ? ' creating' : ''}`}
        onPointerDown={startCreating}
        onPointerMove={drawDraft}
        onPointerUp={finishCreating}
        onPointerCancel={() => {
          createStart.current = null
          setDraft(null)
        }}
        onDoubleClick={addOnDoubleClick}
      >
        {notes.length === 0 && !isCreating && (
          <div className="empty-state">
            <span>+</span>
            <h2>Your board is empty</h2>
            <p>Choose a color, then add your first note.</p>
            <button type="button" onClick={() => setIsCreating(true)}>
              Create a note
            </button>
          </div>
        )}
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            boardWidth={boardSize.width}
            boardHeight={boardSize.height}
            onChange={updateNote}
            onFocus={bringToFront}
            onRemove={removeNote}
            onTrashChange={setIsTrashActive}
            isOverTrash={isOverTrash}
          />
        ))}
        {draft && (
          <div
            className={`note-draft color-${color}`}
            style={{
              left: draft.x,
              top: draft.y,
              width: draft.width,
              height: draft.height,
            }}
          />
        )}
        {isCreating && !draft && (
          <div className="create-hint">
            Click and drag anywhere to draw your note
          </div>
        )}
        <div
          ref={trashRef}
          className={`trash-zone${isTrashActive ? ' active' : ''}`}
        >
          <TrashIcon />
          <span>
            {isTrashActive ? 'Release to delete' : 'Drag here to delete'}
          </span>
        </div>
      </section>
    </main>
  )
}

export default App
