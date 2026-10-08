import { MAX_NOTES, NOTE_COLORS } from '../constants'
import type { NoteColor } from '../types'
import { NoteIcon, PlusIcon, TrashIcon } from './Icons'

type ToolbarProps = {
  color: NoteColor
  isCreating: boolean
  noteCount: number
  onColorChange: (color: NoteColor) => void
  onCreate: () => void
  onClear: () => void
}

export function Toolbar({
  color,
  isCreating,
  noteCount,
  onColorChange,
  onCreate,
  onClear,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar-title">
        <div className="brand">
          <span className="brand-icon">
            <NoteIcon />
          </span>
          <span>Sticky</span>
        </div>
        <div className="board-summary">
          <strong>My board</strong>
          <span>
            {noteCount} / {MAX_NOTES} {noteCount === 1 ? 'note' : 'notes'} ·
            saved locally
          </span>
        </div>
      </div>
      <div className="toolbar-actions">
        <div className="color-picker" aria-label="New note color">
          {NOTE_COLORS.map((item) => (
            <button
              key={item}
              className={`color-dot color-${item}${color === item ? ' selected' : ''}`}
              type="button"
              onClick={() => onColorChange(item)}
              aria-label={`Use ${item}`}
              aria-pressed={color === item}
            />
          ))}
        </div>
        <button
          className={`primary-button${isCreating ? ' active' : ''}`}
          type="button"
          onClick={onCreate}
          disabled={!isCreating && noteCount >= MAX_NOTES}
          title={
            noteCount >= MAX_NOTES
              ? `Maximum of ${MAX_NOTES} notes reached`
              : undefined
          }
        >
          {!isCreating && <PlusIcon />}
          {isCreating ? 'Cancel' : 'New note'}
        </button>
        <button
          className="clear-button"
          type="button"
          onClick={onClear}
          disabled={noteCount === 0}
        >
          <TrashIcon size={17} /> Clear all
        </button>
      </div>
    </header>
  )
}
