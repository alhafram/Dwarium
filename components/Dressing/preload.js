const {
    ipcRenderer,
    contextBridge
} = require('electron')
const configService = require('../../services/ConfigService')

contextBridge.exposeInMainWorld('myAPI', {
    makeRequest: async (req) => {
        return await ipcRenderer.invoke('MakeWebRequest', req)
    },
    server: () => {
        return configService.server
    },
    loadItemsData: async (types) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    saveSet: (set) => {
        configService.writeData(set.id, JSON.stringify(set))
    },
    removeSet: (id) => {
        configService.writeData(id, null)
    },
    loadSets: () => {
        return configService.sets()
    }
})
