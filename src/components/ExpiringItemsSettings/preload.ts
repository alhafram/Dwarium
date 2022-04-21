import setupMode from '../../services/DarkModeHandler'
import { ExpiringItemsSettingsWindowActions } from './Actions'
import { ExpiringItemsSettingsWindowState } from './ExpiringItemsSettingsWindowState'
import reduce from './Reducer'
import { render, setupFilters, setupView } from './Renderer'

let initialState: ExpiringItemsSettingsWindowState = {
    allItems: [],
    currentItems: [],
    activeFilters: [],
    userConfig: null,
    searchEffect: ''
}

export default async function dispatch(action: ExpiringItemsSettingsWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

window.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    setupView()
    setupFilters()
    dispatch(ExpiringItemsSettingsWindowActions.LOAD_CONTENT)
})
