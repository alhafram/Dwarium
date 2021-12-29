const { checkLmtsProxyReady, setupChatTotalReconnect, setupChatInterval, setupReceiver, setupAutoResponder, setupShortcut } = require('../Chat/Chat')

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

    console.log(new Date(), "DONE 1")
})