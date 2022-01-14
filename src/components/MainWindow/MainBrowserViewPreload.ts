// @ts-nocheck
const {
    checkLmtsProxyReady,
    setupChatTotalReconnect,
    setupChatInterval,
    setupReceiver,
    setupAutoResponder,
    setupShortcut
} = require('./Chat')

window.addEventListener('DOMContentLoaded', async () => {

    // TODO - TS migration
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
            // setupAutoResponder() // TODO: - 1.1.0
            setupShortcut()
        }
    }, 100)

    console.log(new Date(), "DONE 1")
})
