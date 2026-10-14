import {
  memo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from '../constants'
import type { Note, Rect } from '../types'

type DragState = {
  startX: number
  startY: number
  noteX: number
  noteY: number
  currentX: number
  currentY: number
}
type StickyNoteProps = {
  note: Note
  boardWidth: number
  boardHeight: number
  onChange: (id: string, changes: Partial<Note>) => void
  onFocus: (id: string) => void
  onRemove: (id: string) => void
  onTrashChange: (active: boolean) => void
  isOverTrash: (rect: Rect) => boolean
}

export const StickyNote = memo(function StickyNote({
  note,
  boardWidth,
  boardHeight,
  onChange,
  onFocus,
  onRemove,
  onTrashChange,
  isOverTrash,
}: StickyNoteProps) {
  const drag = useRef<DragState | null>(null)
  const resize = useRef<DragState | null>(null)
  const trashActive = useRef(false)
  const [preview, setPreview] = useState<Rect | null>(null)
  const renderedRect = preview ?? note

  const updateTrashState = (rect: Rect) => {
    const active = isOverTrash(rect)
    if (active === trashActive.current) return
    trashActive.current = active
    onTrashChange(active)
  }

  const resetTrashState = () => {
    if (!trashActive.current) return
    trashActive.current = false
    onTrashChange(false)
  }

  const startMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      noteX: note.x,
      noteY: note.y,
      currentX: note.x,
      currentY: note.y,
    }
    onFocus(note.id)
  }
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const x = Math.max(
      0,
      Math.min(
        boardWidth - note.width,
        drag.current.noteX + event.clientX - drag.current.startX,
      ),
    )
    const y = Math.max(
      0,
      Math.min(
        boardHeight - 42,
        drag.current.noteY + event.clientY - drag.current.startY,
      ),
    )
    drag.current.currentX = x
    drag.current.currentY = y
    const nextRect = { x, y, width: note.width, height: note.height }
    setPreview(nextRect)
    updateTrashState(nextRect)
  }
  const finishMove = () => {
    if (!drag.current) return
    const finalRect = {
      x: drag.current.currentX,
      y: drag.current.currentY,
      width: note.width,
      height: note.height,
    }
    drag.current = null
    const shouldRemove = isOverTrash(finalRect)
    resetTrashState()
    setPreview(null)
    if (shouldRemove && window.confirm('Delete this note?')) {
      onRemove(note.id)
      return
    }
    onChange(note.id, { x: finalRect.x, y: finalRect.y })
  }
  const cancelMove = () => {
    drag.current = null
    setPreview(null)
    resetTrashState()
  }
  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    resize.current = {
      startX: event.clientX,
      startY: event.clientY,
      noteX: note.width,
      noteY: note.height,
      currentX: note.width,
      currentY: note.height,
    }
    onFocus(note.id)
  }
  const resizeNote = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!resize.current) return
    const width = Math.max(
      MIN_NOTE_WIDTH,
      Math.min(
        boardWidth - note.x,
        resize.current.noteX + event.clientX - resize.current.startX,
      ),
    )
    const height = Math.max(
      MIN_NOTE_HEIGHT,
      Math.min(
        boardHeight - note.y,
        resize.current.noteY + event.clientY - resize.current.startY,
      ),
    )
    resize.current.currentX = width
    resize.current.currentY = height
    setPreview({ x: note.x, y: note.y, width, height })
  }
  const finishResize = () => {
    if (!resize.current) return
    const width = resize.current.currentX
    const height = resize.current.currentY
    resize.current = null
    setPreview(null)
    onChange(note.id, { width, height })
  }
  const cancelResize = () => {
    resize.current = null
    setPreview(null)
  }

  return (
    <article
      className={`sticky-note color-${note.color}`}
      style={{
        left: renderedRect.x,
        top: renderedRect.y,
        width: renderedRect.width,
        height: renderedRect.height,
        zIndex: note.zIndex,
      }}
      onPointerDown={() => onFocus(note.id)}
    >
      <div
        className="note-grip"
        onPointerDown={startMove}
        onPointerMove={move}
        onPointerUp={finishMove}
        onPointerCancel={cancelMove}
        aria-label="Drag note"
      >
        <span />
        <span />
        <span />
      </div>
      <textarea
        value={note.text}
        onChange={(event) => onChange(note.id, { text: event.target.value })}
        placeholder="Write something…"
        aria-label="Note text"
        spellCheck="true"
      />
      <button
        className="resize-handle"
        type="button"
        onPointerDown={startResize}
        onPointerMove={resizeNote}
        onPointerUp={finishResize}
        onPointerCancel={cancelResize}
        aria-label="Resize note"
      />
    </article>
  )
})
