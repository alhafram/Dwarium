import setupMode from '../../Services/DarkModeHandler'
import { StatsWindowActions } from './Actions'
import reduce from './Reducer'
import { render, setupView } from './Renderer'
import { StatsWindowState } from './StatsWindowState'

let initialState: StatsWindowState = {
    dropInfo: null,
    selectedDate: Date(),
    selectedDateMoney: 0,
    selectedDateItems: [],
    selectedDayFightIds: [],
    baseUrl: ''
}

export async function dispatch(action: StatsWindowActions, data?: unknown): Promise<void> {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

window.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    setupView()
    dispatch(StatsWindowActions.LOAD_SETTINGS)
})
