import { GameSettingsWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../services/DarkModeHandler'
import { render, setupView } from './Renderer'
import GameFlagsService from '../../services/GameFlagsService'
import { GameSettingsWindowState } from './GameSettingsWindowState'

const flags = GameFlagsService.getGameFlags()
let initialState: GameSettingsWindowState = {
    gameLocationFlags: flags.gameLocationFlags,
    gameTopMenuFlags: flags.gameTopMenuFlags,
    gameRightMenuFlags: flags.gameRightMenuFlags,
    huntFlags: flags.huntFlags
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
