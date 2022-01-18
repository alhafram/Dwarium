import { contextBridge } from 'electron'
import configService from '../../services/ConfigService'

contextBridge.exposeInMainWorld('notesAPI', {
    loadNotes: () => {
        return configService.notes()
    },
    saveNote: (note: any) => {
        configService.writeData(note.id, JSON.stringify(note))
    },
    removeNote: (id: string) => {
        configService.writeData(id, null)
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
