import { GameSettingsWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../services/DarkModeHandler'
import { render, setupView } from './Renderer'
import GameFlagsService from '../../services/GameFlagsService'
import { GameSettingsWindowState } from './GameSettingsWindowState'

let initialState: GameSettingsWindowState = {
    gameFlags: GameFlagsService.getGameFlags()
}

export function dispatch(action: GameSettingsWindowActions, data?: unknown): void {
    initialState = reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    dispatch(GameSettingsWindowActions.LOAD_SETTINGS)
    setupMode()
    setupView()
})
