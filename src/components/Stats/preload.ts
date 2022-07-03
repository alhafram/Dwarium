import setupMode from '../../services/DarkModeHandler'
import { StatsWindowActions } from './Actions'
import reduce from './Reducer'
import { render, setupView } from './Renderer'
import { StatsWindowState } from './StatsWindowState'

let initialState: StatsWindowState = {
    dropInfo: null,
    selectedDate: Date(),
    selectedDateDrop: []
}

export function dispatch(action: StatsWindowActions, data?: unknown): void {
    initialState = reduce(initialState, action, data)
    render(initialState)
}

window.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    setupView()
    dispatch(StatsWindowActions.LOAD_SETTINGS)
})
