import { app, Notification, getCurrentWindow } from '@electron/remote'
import ConfigService from './ConfigService'

type ChatMessage = {
    channel: number
    msg_text: string | null | undefined
    bonus_text: number | null | undefined,
    to_user_nicks: string[] | undefined
}

const notificationTitle = 'Оповещение!'

enum NotificationDescription {
    ATTACKED = 'На вас совершено нападение!',
    BATTLEGROUND = 'Получена сюдашка на поле боя!',
    MESSAGE = 'Получено новое сообщение!'
}

export default function sendNotification(message: ChatMessage | null) {

    // @ts-ignore
    const nickname = top[0]?.canvas?.app?.avatar?.model?.login ?? ''

    if(message?.channel == 2 && message?.msg_text?.toLocaleLowerCase().includes("на вас совершено")) {
        setupBounce('critical')
        setupFlashFlame()
        if(ConfigService.fightNotificationsSystem()) {
            new Notification({ title: notificationTitle, body: NotificationDescription.ATTACKED }).show()
        }
        if(ConfigService.fightNotificationsIngame()) {
            playIngameNotificationSound()
        }
    }

    if(message?.channel == 2 && message?.bonus_text == 1 && message?.msg_text?.includes("<b class=\"redd\">Для того, чтобы подтвердить свое участие ")) {
        setupBounce('critical')
        setupFlashFlame()
        if(ConfigService.battlegroundNotificationsSystem()) {
            new Notification({ title: notificationTitle, body: NotificationDescription.BATTLEGROUND }).show()
        }
        if(ConfigService.battlegroundNotificationsIngame()) {
            playIngameNotificationSound()
        }
    }

    if(message?.to_user_nicks != undefined) {
        if(Object.values(message.to_user_nicks).includes(nickname)) {
            setupFlashFlame()
            setupBounce('informational')
            if(ConfigService.messageNotificationsSystem()) {
                new Notification({ title: notificationTitle, body: NotificationDescription.MESSAGE }).show()
            }
            if(ConfigService.messageNotificationsIngame()) {
                playIngameNotificationSound()
            }
        }
    }
}

function setupFlashFlame() {
    const currentWindow = getCurrentWindow()
    if(process.platform == 'win32') {
        currentWindow.flashFrame(!currentWindow.isFocused())
    }
}

function setupBounce(type: 'critical' | 'informational') {
    if(process.platform == 'darwin') {
        app.dock.bounce('informational')
    }
}

function playIngameNotificationSound() {
    var audio = new Audio('file://' + app.getAppPath() + '/Resources/message.ogg')
    audio.play()
}