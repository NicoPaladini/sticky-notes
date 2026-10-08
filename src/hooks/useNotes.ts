import { useCallback, useEffect, useState } from 'react'
import { MAX_NOTES, NOTES_STORAGE_KEY, STARTER_NOTES } from '../constants'
import type { Note, NoteColor, Rect } from '../types'

function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem(NOTES_STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Note[]) : STARTER_NOTES
  } catch {
    return STARTER_NOTES
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)

  useEffect(() => {
    // Wait briefly so dragging does not write to storage on every pointer move.
    const timeout = window.setTimeout(() => {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
    }, 200)
    return () => window.clearTimeout(timeout)
  }, [notes])

  const addNote = useCallback((rect: Rect, color: NoteColor) => {
    setNotes((current) => {
      if (current.length >= MAX_NOTES) return current
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          text: '',
          color,
          ...rect,
          zIndex: Math.max(0, ...current.map((note) => note.zIndex)) + 1,
        },
      ]
    })
  }, [])

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    )
  }, [])

  const bringToFront = useCallback((id: string) => {
    setNotes((current) => {
      const selected = current.find((note) => note.id === id)
      const topZIndex = Math.max(0, ...current.map((note) => note.zIndex))
      if (!selected || selected.zIndex === topZIndex) return current
      return current.map((note) =>
        note.id === id ? { ...note, zIndex: topZIndex + 1 } : note,
      )
    })
  }, [])

  const removeNote = useCallback(
    (id: string) =>
      setNotes((current) => current.filter((note) => note.id !== id)),
    [],
  )
  const clearNotes = useCallback(() => setNotes([]), [])

  return { notes, addNote, updateNote, bringToFront, removeNote, clearNotes }
}
