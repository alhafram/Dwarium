type Note = {
    id: string,
    text: string,
    isNew: boolean,
    date: string
}

type NotesWindowState = {
    notes: Note[],
    currentNote: Note | null
}

enum NotesWindowActions {
    LOAD_CONTENT,
    CREATE_NEW_NOTE,
    SAVE_NOTE,
    REMOVE_NOTE,
    SELECT_NOTE
}

const Elements = {
    notesBox(): HTMLDivElement {
        return document.getElementsByClassName('sets')[0] as HTMLDivElement
    },
    addNoteBox(): HTMLInputElement {
        return document.getElementById('addSetButton') as HTMLInputElement
    },
    dropNoteBox(): HTMLButtonElement {
        return document.getElementById('dropSetButton') as HTMLButtonElement
    },
    editorBox(): HTMLTextAreaElement {
        return document.getElementById('editor') as HTMLTextAreaElement
    }
}

var initialState: NotesWindowState = {
    notes: [],
    currentNote: null
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

function generateNoteId() {
    return 'note_' + generateRandomId()
}

function addNewNote(): Note {
    let id = generateNoteId()
    let newSet: Note = {
        id: id,
        text: '',
        isNew: true,
        date: (new Date()).toLocaleString()
    }
    return newSet
}

let dragableNote: HTMLElement | null = null

function createNoteElement(note: Note, active: boolean = false) {
    let article = document.createElement('article')
    article.id = note.id
    article.draggable = true
    let className = active ? 'leaderboard__profile active' : 'leaderboard__profile'
    article.className = className
    article.onclick = function(e) {
        dispatch(NotesWindowActions.SELECT_NOTE, note)
    }
    article.ondragstart = function() {
        article.style.opacity = '0.4'
        dragableNote = article
    }
    article.ondragend = function() {
        article.style.opacity = '1'
        dragableNote = null
    }
    article.ondragover = function(e) {
        e.preventDefault()
    }
    let contentDiv = document.createElement('div')
    contentDiv.style.display = 'inline-grid'
    let dateSpan = document.createElement('span')
    dateSpan.className = 'leaderboard__name'
    dateSpan.textContent = note.date

    let textSpan = document.createElement('span')
    textSpan.className = 'leaderboard__name text'
    textSpan.textContent = note.text

    contentDiv.appendChild(dateSpan)
    contentDiv.appendChild(textSpan)

    article.appendChild(contentDiv)

    return article
}

async function reduce(state: NotesWindowState = initialState, action: NotesWindowActions, data ? : any): Promise < NotesWindowState > {
    switch(action) {
        case NotesWindowActions.LOAD_CONTENT:
            const loadedNotes = window.notesAPI.loadNotes() as Note[]
            return {
                ...state,
                notes: loadedNotes
            }
        case NotesWindowActions.CREATE_NEW_NOTE:
            Elements.editorBox().value = ''
            const newNote = data as Note
            window.notesAPI.saveNote(newNote)
            let currentNotes = state.notes
            currentNotes.push(newNote)
            return {
                ...state,
                notes: currentNotes,
                    currentNote: newNote
            }
        case NotesWindowActions.SAVE_NOTE:
            let note = state.currentNote
            let notes1 = state.notes
            if(note) {
                note.text = Elements.editorBox().value
                notes1[notes1.indexOf(note)] = note
            } else {
                note = {
                    id: generateNoteId(),
                    text: Elements.editorBox().value,
                    date: (new Date()).toLocaleString(),
                    isNew: true
                }
                notes1.push(note)
            }
            window.notesAPI.saveNote(note)
            return {
                ...state,
                currentNote: note,
                    notes: notes1
            }
        case NotesWindowActions.REMOVE_NOTE:
            Elements.editorBox().value = ''
            let deletedNoteBox = data as HTMLDivElement | null
            let notes = state.notes
            const deletedNote = notes.find(note => note.id == deletedNoteBox?.id)
            if(deletedNote) {
                const isCurrentNote = deletedNote == state.currentNote
                const deletedNoteId = deletedNote?.id
                notes = notes.removeItem(deletedNote)
                window.notesAPI.removeNote(deletedNoteId)
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
        case NotesWindowActions.SELECT_NOTE:
            const selectedNote = data as Note
            return {
                ...state,
                currentNote: selectedNote
            }
    }
}

async function dispatch(action: NotesWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render()
}

function render(): void {
    Array.from(Elements.notesBox().children).filter(element => element.id.startsWith('note_')).forEach(element => Elements.notesBox().removeChild(element))
    for(const set of initialState.notes) {
        const isActive = initialState.currentNote?.id == set.id
        let setDiv = createNoteElement(set, isActive)
        if(isActive) {
            Elements.editorBox().value = set.text
        }
        if(set.isNew) {
            Elements.notesBox().insertBefore(setDiv, Elements.notesBox().firstElementChild?.nextElementSibling!)
        } else {
            Elements.notesBox().appendChild(setDiv)
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    dispatch(NotesWindowActions.LOAD_CONTENT)
    Elements.addNoteBox().onclick = function() {
        const newNote = addNewNote()
        dispatch(NotesWindowActions.CREATE_NEW_NOTE, newNote)
    }
    Elements.dropNoteBox().ondrop = function(e) {
        e.preventDefault()
        dispatch(NotesWindowActions.REMOVE_NOTE, dragableNote)
    }
    Elements.dropNoteBox().ondragover = function(e) {
        e.preventDefault()
    }
    Elements.editorBox().onkeyup = function() {
        dispatch(NotesWindowActions.SAVE_NOTE)
    }
})

export {}
