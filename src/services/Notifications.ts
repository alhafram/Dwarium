import { app, Notification, getCurrentWindow } from '@electron/remote'
import ConfigService from './ConfigService'

type ChatMessageUserNicks = {
    [key: number]: string
}

export type ChatMessage = {
    channel: number
    msg_text: string | null | undefined
    bonus_text: number | null | undefined
    to_user_nicks: ChatMessageUserNicks | undefined
    user_nick: string | null | undefined
}

const notificationTitle = 'Оповещение!'

enum NotificationType {
    ATTACKED = 'На вас совершено нападение!',
    BATTLEGROUND = 'Получена сюдашка на поле боя!',
    MESSAGE = 'Получено новое сообщение!',
    MAIL = 'Получено новое письмо!'
}

function getSoundFor(notificationType: NotificationType) {
    switch (notificationType) {
        case NotificationType.ATTACKED:
            return 'attacked.ogg'
        case NotificationType.BATTLEGROUND:
            return 'battleground.ogg'
        case NotificationType.MESSAGE:
            return 'message.ogg'
        case NotificationType.MAIL:
            return 'mail.ogg'
    }
}

export default function sendNotification(message: ChatMessage | null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nickname = top[0]?.canvas?.app?.avatar?.model?.login ?? ''

    if(message?.channel == 2 && message?.msg_text?.toLocaleLowerCase().includes('на вас совершено') && !message.to_user_nicks) {
        setupBounce('critical')
        setupFlashFlame()
        if(ConfigService.getSettings().fightNotificationsSystem && currentWindowNotFocused()) {
            new Notification({ title: notificationTitle, body: NotificationType.ATTACKED }).show()
        }
        if(ConfigService.getSettings().fightNotificationsIngame) {
            playIngameNotificationSound(NotificationType.ATTACKED)
        }
    }

    if(message?.channel == 2 && message?.msg_text?.toLocaleLowerCase().includes('у вас новое письмо от игрока') && !message.to_user_nicks) {
        setupBounce('informational')
        setupFlashFlame()
        if(ConfigService.getSettings().mailNotificationsSystem && currentWindowNotFocused()) {
            new Notification({ title: notificationTitle, body: NotificationType.MAIL }).show()
        }
        if(ConfigService.getSettings().mailNotificationsIngame) {
            playIngameNotificationSound(NotificationType.MAIL)
        }
    }

    if(message?.channel == 2 && message?.bonus_text == 1 && message?.msg_text?.includes('<b class="redd">Для того, чтобы подтвердить свое участие ')) {
        setupBounce('critical')
        setupFlashFlame()
        if(ConfigService.getSettings().battlegroundNotificationsSystem && currentWindowNotFocused()) {
            new Notification({ title: notificationTitle, body: NotificationType.BATTLEGROUND }).show()
        }
        if(ConfigService.getSettings().battlegroundNotificationsIngame) {
            playIngameNotificationSound(NotificationType.BATTLEGROUND)
        }
    }

    if(message?.to_user_nicks != undefined) {
        if(Object.values(message.to_user_nicks).includes(nickname)) {
            setupFlashFlame()
            setupBounce('informational')
            if(ConfigService.getSettings().messageNotificationsSystem && currentWindowNotFocused()) {
                new Notification({ title: notificationTitle, body: NotificationType.MESSAGE }).show()
            }
            if(ConfigService.getSettings().messageNotificationsIngame) {
                playIngameNotificationSound(NotificationType.MESSAGE)
            }
        }
    }
}

function setupFlashFlame() {
    const currentWindow = getCurrentWindow()
    if(process.platform == 'win32') {
        currentWindow.flashFrame(currentWindowNotFocused())
    }
}

function setupBounce(type: 'critical' | 'informational') {
    if(process.platform == 'darwin') {
        app.dock.bounce(type)
    }
}

function playIngameNotificationSound(type: NotificationType) {
    const audio = new Audio(`file://${app.getAppPath()}/Resources/${getSoundFor(type)}`)
    audio.play()
}

function currentWindowNotFocused(): boolean {
    const currentWindow = getCurrentWindow()
    return !currentWindow.isFocused()
}
