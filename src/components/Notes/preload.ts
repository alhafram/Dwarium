import { contextBridge } from 'electron'
import configService from '../../services/ConfigService'
import NotesService from '../../services/NotesService'

contextBridge.exposeInMainWorld('notesAPI', {
    // Refactor 1.0.15
    loadOldNotes: () => {
        return configService.notes()
    },
    loadNewNotes: () => {
        return NotesService.notes()
    },
    saveNote: (note: any) => {
        NotesService.writeData(note.id, JSON.stringify(note))
    },
    removeNote: (id: string) => {
        configService.writeData(id, null)
        NotesService.writeData(id, null)
    }
})

export interface NotesAPI {
    loadOldNotes: () => any,
    loadNewNotes: () => any,
    saveNote: (note: {}) => void,
    removeNote: (id: string) => void
}

declare global {
    interface Window {
        notesAPI: NotesAPI
    }
}
