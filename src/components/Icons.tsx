type IconProps = { size?: number }

export function PlusIcon({ size = 18 }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

export function TrashIcon({ size = 21 }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16m-10 4v6m4-6v6M9 7l1-3h4l1 3m3 0-1 14H7L6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function NoteIcon({ size = 20 }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h9l4 4v14H6V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M15 3v5h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
