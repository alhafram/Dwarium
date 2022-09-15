import setupMode from '../../Services/DarkModeHandler'
import { DressingWindowState } from './DressingWindowState'
import { DressingWindowActions } from './Actions'
import reduce from './Reducer'
import { render, setupView } from './Renderer'

let initialState: DressingWindowState = {
    selectedStaticItemId: null,
    currentEquipedItems: [],
    arcats: [],
    rings: [],
    amulets: [],
    activeFilters: [],
    sets: [],
    currentSet: null,
    allItems: [],
    currentStyle: null,
    currentMagicSchool: null,
    arcatsCount: 0,
    zikkuratId: null,
    userConfig: null
}

export default async function dispatch(action: DressingWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    dispatch(DressingWindowActions.LOAD_CONTENT)
    setupMode()
    setupView()
})
