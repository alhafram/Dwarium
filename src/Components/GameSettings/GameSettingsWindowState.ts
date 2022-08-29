import { FightFlags, GameLocationFlags, GameRightMenuFlags, GameTopMenuFlags, HuntFlags } from '../../services/GameFlagsService'

export interface GameSettingsWindowState {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
    gameRightMenuFlags: GameRightMenuFlags
    huntFlags: HuntFlags
    fightFlags: FightFlags
}
