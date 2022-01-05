const {
    ipcRenderer,
    contextBridge
} = require('electron')
const configService = require('../../services/ConfigService')

contextBridge.exposeInMainWorld('myAPI', {
    baseUrl: () => {
        return configService.baseUrl()
    },
    loadItemsData: async (types) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    makeRequest: async (req) => {
        return await ipcRenderer.invoke('MakeWebRequest', req)
    },
    loadBeltSets: () => {
        return configService.beltSets()
    },
    saveSet: (set) => {
        configService.writeData(set.id, JSON.stringify(set))
    },
    removeSet: (id) => {
        configService.writeData(id, null)
    },
})
