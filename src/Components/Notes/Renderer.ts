import { ListElements } from '../Common/List/Elements'
import { NotesWindowActions } from './Actions'
import { Elements } from './Elements'
import { Note, NotesWindowState } from './NotesWindowState'
import dispatch from './preload'

let dragableNote: HTMLElement | null = null

function createNoteElement(note: Note, isActive = false) {
    const newNoteString = `
    <div id="${note.id}" draggable="true" class="hover:bg-lightMediumGrey dark:hover:bg-secondaryDark mt-3 cursor-pointer w-40 h-14 ${
    isActive ? 'bg-lightMediumGrey dark:bg-secondaryDark border-4 border-dashed border-secondaryLightDark dark:border-secondaryLight' : 'bg-light dark:bg-secondaryBlack'
} rounded-3xl">
        <p class="pl-2 pt-2 text-secondaryLightDark dark:text-secondaryLight text-ellipsis whitespace-nowrap overflow-hidden font-montserrat font-extrabold text-xss">${note.text}</p>
        <p class="pl-2 text-secondaryLightDark dark:text-secondaryLight font-montserrat font-light text-xs">${note.date}</p>
    </div>`
    const parser = new DOMParser()
    const newNoteDiv = parser.parseFromString(newNoteString, 'text/html').body.firstElementChild as HTMLDivElement
    newNoteDiv.ondragstart = function() {
        newNoteDiv.style.opacity = '0.4'
        dragableNote = newNoteDiv
        ListElements.removeSetDiv().classList.replace('basket', 'basketActive')
        ListElements.basketIcon().classList.replace('basketIcon', 'basketIconActive')
    }
    newNoteDiv.ondragend = function() {
        newNoteDiv.style.opacity = '1'
        dragableNote = null
        ListElements.removeSetDiv().classList.replace('basketActive', 'basket')
        ListElements.basketIcon().classList.replace('basketIconActive', 'basketIcon')
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
    Array.from(ListElements.setsDiv().children)
        .filter((element) => element.id.startsWith('note_'))
        .forEach((element) => ListElements.setsDiv().removeChild(element))
    for(const set of state.notes) {
        const isActive = state.currentNote?.id == set.id
        const setDiv = createNoteElement(set, isActive)
        if(isActive) {
            Elements.editorTextarea().value = set.text
        }
        ListElements.setsDiv().appendChild(setDiv)
    }
}

function getDragableNote() {
    return dragableNote
}

export { render, getDragableNote }
