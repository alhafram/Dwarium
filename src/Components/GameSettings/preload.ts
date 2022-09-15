import { GameSettingsWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../Services/DarkModeHandler'
import { render, setupView } from './Renderer'
import GameFlagsService from '../../Services/GameFlagsService'
import { GameSettingsWindowState } from './GameSettingsWindowState'

const flags = GameFlagsService.getGameFlags()
let initialState: GameSettingsWindowState = {
    gameLocationFlags: flags.gameLocationFlags,
    gameTopMenuFlags: flags.gameTopMenuFlags,
    gameRightMenuFlags: flags.gameRightMenuFlags,
    huntFlags: flags.huntFlags,
    fightFlags: flags.fightFlags
}

export function dispatch(action: GameSettingsWindowActions): void {
    initialState = reduce(initialState, action)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    dispatch(GameSettingsWindowActions.LOAD_SETTINGS)
    setupMode()
    setupView()
})
