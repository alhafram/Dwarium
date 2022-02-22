import ConfigService from './ConfigService'

function setupSpeed() {
    const animationSpeedType = ConfigService.getSettings().animationSpeedType
    if(animationSpeedType && animationSpeedType != 'gameSpeed') {
        setInterval(() => {
            if(top && top[0] && top[0][1] && top[0][1].document) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const game = top[0][1].document.game
                if(game && game.fps) {
                    // TODO
                    if(animationSpeedType == 'x2Speed') {
                        game.fps = 40
                    }
                    if(animationSpeedType == 'x3Speed') {
                        game.fps = 60
                    }
                }
            }
        }, 500)
    }
}

export default {
    setupSpeed
}
