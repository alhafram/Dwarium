export type Note = {
    id: string
    text: string
    date: string
}

export type NotesWindowState = {
    notes: Note[]
    currentNote: Note | null
}
