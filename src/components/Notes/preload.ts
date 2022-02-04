import { contextBridge } from 'electron'
import NotesService from '../../services/NotesService'

contextBridge.exposeInMainWorld('notesAPI', {
    loadNotes: () => {
        return NotesService.notes()
    },
    saveNote: (note: any) => {
        NotesService.writeData(note.id, JSON.stringify(note))
    },
    removeNote: (id: string) => {
        NotesService.writeData(id, null)
    }
})

export interface NotesAPI {
    loadNotes: () => any,
    saveNote: (note: {}) => void,
    removeNote: (id: string) => void
}

declare global {
    interface Window {
        notesAPI: NotesAPI
    }
}
