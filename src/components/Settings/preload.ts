import { contextBridge, ipcRenderer } from 'electron'
import { app } from '@electron/remote'
import configService from '../../services/ConfigService'

contextBridge.exposeInMainWorld('myAPI', {
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
    }
})

export interface IMyAPI {
    saveSettings: (settings: {}) => void,
    loadSettings: () => any,
    restart: () => void
}

declare global {
    interface Window {
        myAPI: IMyAPI
    }
}