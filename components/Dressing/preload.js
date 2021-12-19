const {
    ipcRenderer,
    contextBridge
} = require("electron")
const configService = require('../../services/ConfigService')
require('./utils')

contextBridge.exposeInMainWorld('myAPI', {
    makeRequest: async (req) => {
        return await ipcRenderer.invoke("MakeWebRequest", req)
    },
    server: () => {
        return configService.server
    },
    loadItemsData: async () => {
        return await ipcRenderer.invoke("LoadSetItems")
    },
    saveSet: (set) => {
        console.log("Save set to config: ", set)
    }
})
