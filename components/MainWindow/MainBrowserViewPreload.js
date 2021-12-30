const {
    checkLmtsProxyReady,
    setupChatTotalReconnect,
    setupChatInterval,
    setupReceiver,
    setupAutoResponder,
    setupShortcut
} = require('../Chat/Chat')
const configService = require('../../services/ConfigService')

const {
    ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', async () => {

    let firstInterval = setInterval(async () => {
        if(!top[1] || !top[1].LMTS) {
            return
        }
        if(top[1].LMTS.isConnected() && top[1].LMTS.isAuthorized()) {
            setupReceiver()
            checkLmtsProxyReady()
            clearInterval(firstInterval)
            console.log(new Date(), "DONE 2")
            setupChatTotalReconnect()
            setupChatInterval()
            setupAutoResponder()
            setupShortcut()
        }
    }, 100)

    ipcRenderer.on('AuthComplete', async () => {
        await fetch(configService.baseUrl(), {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-GB",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "upgrade-insecure-requests": "1"
            },
            "referrer": configService.baseUrl(),
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": "soc_system_auth=18",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
        window.location.reload()
    })
})
