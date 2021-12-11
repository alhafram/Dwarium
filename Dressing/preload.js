const {
    ipcRenderer,
    contextBridge
} = require("electron")

const configService = require('../services/ConfigService')

contextBridge.exposeInMainWorld('myAPI', {
    makeRequest: async(req) => {
        return await ipcRenderer.invoke("MakeRequest", req)
    },
    server: () => {
        return configService.server
    },
    loadData: async() => {
        return await ipcRenderer.invoke("LoadSetItems")
    }
})
