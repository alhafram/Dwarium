import { GameLocationFlags, GameTopMenuFlags } from '../../services/GameFlagsService'

export interface GameSettingsWindowState {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
}