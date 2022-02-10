import { BrowserView, BrowserWindow } from 'electron'
import contextMenu from 'electron-context-menu'

export default function setupContextMenu(window: BrowserView | BrowserWindow) {
    contextMenu({
        window: window,
        labels: {
            copy: 'Копировать',
            paste: 'Вставить',
            cut: 'Вырезать',
            saveImageAs: 'Сохранить картинку как...',
            copyImageAddress: 'Копировать URL картинки',
            copyImage: 'Копировать картинку',
            copyLink: 'Копировать ссылку'
        },
        menu: (actions) => [
            {
                label: 'Обновить',
                click: () => {
                    window.webContents.reload()
                }
            },
            {
                label: 'Назад',
                click: () => {
                    window.webContents.goBack()
                },
                enabled: window.webContents.canGoBack()
            },
            {
                label: 'Вперед',
                click: () => {
                    window.webContents.goForward()
                },
                enabled: window.webContents.canGoForward()
            },
            actions.separator(),
            actions.copy({}),
            actions.paste({}),
            actions.cut({}),
            actions.separator(),
            actions.saveImageAs({}),
            actions.copyImageAddress({}),
            actions.copyImage({}),
            actions.copyLink({})
        ]
    })
}
