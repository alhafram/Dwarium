import { FightFlags, GameLocationFlags, GameRightMenuFlags, GameTopMenuFlags, HuntFlags } from '../../Services/GameFlagsService'

export interface GameSettingsWindowState {
    gameLocationFlags: GameLocationFlags
    gameTopMenuFlags: GameTopMenuFlags
    gameRightMenuFlags: GameRightMenuFlags
    huntFlags: HuntFlags
    fightFlags: FightFlags
}
