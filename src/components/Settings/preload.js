const {
    contextBridge
} = require('electron')
const {
    app
} = require('@electron/remote')
const configService = require('../../services/ConfigService')

contextBridge.exposeInMainWorld('myAPI', {
    saveSettings: (settings) => {
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
