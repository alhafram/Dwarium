import { NotesWindowActions } from "./Actions"
import { Elements } from "./Elements"
import { Note, NotesWindowState } from "./NotesWindowState"
import dispatch from './preload'

let dragableNote: HTMLElement | null = null

function createNoteElement(note: Note, isActive: boolean = false) {
    const newNoteString = `
    <div id="${note.id}" draggable="true" class="hover:bg-lightMediumGrey dark:hover:bg-secondaryDark mt-3 cursor-pointer w-40 h-14 ${isActive ? 'bg-lightMediumGrey dark:bg-secondaryDark border-4 border-dashed border-secondaryLightDark dark:border-secondaryLight' : 'bg-light dark:bg-secondaryBlack' } rounded-3xl">
        <p class="pl-2 pt-2 text-secondaryLightDark dark:text-secondaryLight text-ellipsis whitespace-nowrap overflow-hidden font-montserrat font-extrabold text-xss">${note.text}</p>
        <p class="pl-2 text-secondaryLightDark dark:text-secondaryLight font-montserrat font-light text-xs">${note.date}</p>
    </div>`
    const parser = new DOMParser()
    const newNoteDiv = parser.parseFromString(newNoteString, 'text/html').body.firstElementChild as HTMLDivElement
    newNoteDiv.ondragstart = function() {
        newNoteDiv.style.opacity = '0.4'
        dragableNote = newNoteDiv
        Elements.removeNoteDiv().classList.replace('basket', 'basketActive')
        Elements.basketIcon().classList.replace('basketIcon', 'basketIconActive')
    }
    newNoteDiv.ondragend = function() {
        newNoteDiv.style.opacity = '1'
        dragableNote = null
        Elements.removeNoteDiv().classList.replace('basketActive', 'basket')
        Elements.basketIcon().classList.replace('basketIconActive', 'basketIcon')
    }
    newNoteDiv.ondragover = function(e) {
        e.preventDefault()
    }
    newNoteDiv.onclick = function() {
        dispatch(NotesWindowActions.SELECT_NOTE, note)
    }
    return newNoteDiv
}

function render(state: NotesWindowState): void {
    Array.from(Elements.notesDiv().children).filter(element => element.id.startsWith('note_')).forEach(element => Elements.notesDiv().removeChild(element))
    for(const set of state.notes) {
        const isActive = state.currentNote?.id == set.id
        let setDiv = createNoteElement(set, isActive)
        if(isActive) {
            Elements.editorTextarea().value = set.text
        }
        Elements.notesDiv().appendChild(setDiv)
    }
}

function getDragableNote() {
    return dragableNote
}

export {
    render,
    getDragableNote
}