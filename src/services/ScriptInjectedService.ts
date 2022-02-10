import ConfigService from './ConfigService'

function setupSpeed() {
    if(ConfigService.enableSpeed()) {
        setInterval(() => {
            if(top && top[0] && top[0][1] && top[0][1].document) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const game = top[0][1].document.game
                if(game && game.fps) {
                    game.fps = 40
                }
            }
        }, 1000)
    }
}

export default {
    setupSpeed
}
