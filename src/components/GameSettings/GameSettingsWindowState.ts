import { GameLocationFlags, GameRightMenuFlags, GameTopMenuFlags } from '../../services/GameFlagsService'

export interface GameSettingsWindowState {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
    gameRightMenuFlags: GameRightMenuFlags
}
