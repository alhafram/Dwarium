import { contextBridge, ipcRenderer } from 'electron'
import { app, shell } from '@electron/remote'
import configService from '../../services/ConfigService'

contextBridge.exposeInMainWorld('settingsAPI', {
    saveSettings: (settings: JSON) => {
        configService.writeData('settings', JSON.stringify(settings))
    },
    loadSettings: () => {
        let loadedSettings = configService.loadSettings()
        if(loadedSettings) {
            loadedSettings = JSON.parse(loadedSettings)
        }
        return loadedSettings ?? {}
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
    loadSettings: () => any,
    restart: () => void,
    screenshotsFolder(): string,
    openScreenshotsFolder(path: string): void
}

declare global {
    interface Window {
        settingsAPI: SettingsAPI
    }
}