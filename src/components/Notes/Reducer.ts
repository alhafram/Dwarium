import NotesService from '../../services/NotesService'
import { NotesWindowActions } from './Actions'
import { Elements } from './Elements'
import { NotesWindowState, Note } from './NotesWindowState'
import '../Common/Utils'
import { generateRandomId } from '../Utils'

function saveNote(note: any) {
    NotesService.writeData(note.id, JSON.stringify(note))
}

function addNewNote(): Note {
    const id = generateNoteId()
    const newSet: Note = {
        id: id,
        text: '',
        date: new Date().toLocaleString()
    }
    return newSet
}

export default async function reduce(state: NotesWindowState, action: NotesWindowActions, data?: any): Promise<NotesWindowState> {
    let notes: Note[] = []
    switch (action) {
        case NotesWindowActions.LOAD_CONTENT:
            notes = NotesService.notes() as Note[]
            return {
                ...state,
                notes: notes
            }
        case NotesWindowActions.CREATE_NEW_NOTE: {
            Elements.editorTextarea().value = ''
            const newNote = addNewNote()
            saveNote(newNote)
            notes = state.notes
            notes.push(newNote)
            return {
                ...state,
                notes: notes,
                currentNote: newNote
            }
        }
        case NotesWindowActions.SAVE_NOTE: {
            let note = state.currentNote
            notes = state.notes
            if(note) {
                note.text = Elements.editorTextarea().value
                notes[notes.indexOf(note)] = note
            } else {
                note = {
                    id: generateNoteId(),
                    text: Elements.editorTextarea().value,
                    date: new Date().toLocaleString()
                }
                notes.push(note)
            }
            saveNote(note)
            return {
                ...state,
                currentNote: note,
                notes: notes
            }
        }
        case NotesWindowActions.REMOVE_NOTE: {
            Elements.editorTextarea().value = ''
            const deletedNoteBox = data as HTMLDivElement | null
            notes = state.notes
            const deletedNote = notes.find((note) => note.id == deletedNoteBox?.id)
            if(deletedNote) {
                const isCurrentNote = deletedNote == state.currentNote
                const deletedNoteId = deletedNote?.id
                notes = notes.removeItem(deletedNote)
                NotesService.writeData(deletedNoteId, null)
                const currentNote = isCurrentNote ? null : state.currentNote
                return {
                    ...state,
                    notes: notes,
                    currentNote: currentNote
                }
            } else {
                return {
                    ...state
                }
            }
        }
        case NotesWindowActions.SELECT_NOTE: {
            const selectedNote = data as Note
            return {
                ...state,
                currentNote: selectedNote
            }
        }
    }
}

function generateNoteId() {
    return 'note_' + generateRandomId()
}
