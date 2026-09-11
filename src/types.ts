export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green'

export type Note = {
  id: string
  text: string
  color: NoteColor
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

export type Rect = Pick<Note, 'x' | 'y' | 'width' | 'height'>
