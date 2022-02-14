import { contextBridge, ipcRenderer } from 'electron'
import { app, shell } from '@electron/remote'
import ConfigService from '../../services/ConfigService'
import { ClientSettings } from '../../Models/ClientSettings'

contextBridge.exposeInMainWorld('settingsAPI', {
    saveSettings: (settings: JSON) => {
        ConfigService.writeData('settings', JSON.stringify(settings))
    },
    loadSettings: () => {
        return ConfigService.getSettings()
    },
    restart: () => {
        app.relaunch()
        app.quit()
    },
    screenshotsFolder: () => {
        return app.getPath('userData') + '/screens'
    },
    openScreenshotsFolder: (path: string) => {
        shell.openPath(path)
    }
})

export interface SettingsAPI {
    saveSettings: (settings: {}) => void,
    loadSettings: () => ClientSettings,
    restart: () => void,
    screenshotsFolder(): string,
    openScreenshotsFolder(path: string): void
}

declare global {
    interface Window {
        settingsAPI: SettingsAPI
    }
}