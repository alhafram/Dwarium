import { app } from '@electron/remote'
import ua from 'universal-analytics'
import { WindowType } from '../Models/WindowModels'

let userId = ''
function setupService() {
    if(localStorage.userId) {
        userId = localStorage.userId
    } else {
        userId = window.crypto.randomUUID()
        localStorage.userId = userId
    }
}

function getVisitor() {
    return ua('UA-217573092-2', userId, { cid: userId, uid: userId })
}

function openPage(type: WindowType) {
    console.log(type.toString())
    getVisitor().pageview({ av: app.getVersion(), an: 'Dwarium', dp: type.toString() }, (callback) => {
        console.log(callback)
    })
}

function handleUserSession() {
    type Session = {
        sessionId: string
        finishDate: Date
    }
    const newSession: Session = {
        sessionId: window.crypto.randomUUID(),
        finishDate: addMinutes(3, new Date())
    }
    const session = JSON.parse(localStorage.session ?? JSON.stringify(newSession)) as Session

    let sessionId = ''
    if(new Date(session.finishDate) > new Date()) {
        sessionId = session.sessionId
    } else {
        sessionId = window.crypto.randomUUID()
    }
    session.sessionId = sessionId

    sendActivityEvent()
    setInterval(() => {
        sendActivityEvent()
    }, 1000 * 60 * 3)

    function sendActivityEvent() {
        getVisitor().event('Session', 'Start', `Activity_${sessionId}`, (callback) => {
            if(callback == null) {
                session.finishDate = addMinutes(3, new Date())
                localStorage.session = JSON.stringify(session)
            }
        })
    }
}

function addMinutes(numOfMinutes: number, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes)
    return date
}

export {
    handleUserSession,
    setupService,
    openPage
}