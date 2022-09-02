import { BeltDressingWindowState } from './BeltDressingWindowState'
import { BeltDressingWindowActions } from './Actions'
import setupMode from '../../Services/DarkModeHandler'
import reduce from './Reducer'
import { render, setupView, setupFilters } from './Renderer'

let initialState: BeltDressingWindowState = {
    currentEquipedItems: [],
    slots: 0,
    variants: 0,
    activeFilters: [],
    sets: [],
    currentSet: null,
    allItems: [],
    warning: false,
    userConfig: null
}

export default async function dispatch(action: BeltDressingWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    dispatch(BeltDressingWindowActions.LOAD_CONTENT)
    setupFilters()
    setupView()
})
