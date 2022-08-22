import { Elements } from './Elements'
import { NotesWindowActions } from './Actions'
import { NotesWindowState } from './NotesWindowState'
import setupMode from '../../services/DarkModeHandler'
import reduce from './Reducer'
import { handleDragOver } from '../Common/EventBuilder'
import { render, getDragableNote } from './Renderer'
import { ListElements } from '../Common/List/Elements'

let initialState: NotesWindowState = {
    notes: [],
    currentNote: null
}

export default async function dispatch(action: NotesWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', () => {
    setupMode()
    dispatch(NotesWindowActions.LOAD_CONTENT)
    ListElements.newSetButton().onclick = function() {
        dispatch(NotesWindowActions.CREATE_NEW_NOTE)
    }
    ListElements.removeSetDiv().ondrop = function(e) {
        e.preventDefault()
        dispatch(NotesWindowActions.REMOVE_NOTE, getDragableNote())
    }
    ListElements.removeSetDiv().ondragover = handleDragOver
    Elements.editorTextarea().onkeyup = function() {
        dispatch(NotesWindowActions.SAVE_NOTE)
    }
})
