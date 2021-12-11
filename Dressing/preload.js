const {
    ipcRenderer,
    contextBridge
} = require("electron")

const configService = require('../services/ConfigService')

ipcRenderer.on('getAllItems', (event, items) => {
    var evt = new CustomEvent("AttachDND", {
        detail: {
            items: items
        }
    });
    document.dispatchEvent(evt)
})

ipcRenderer.on('getWearedItems', (event, items) => {
    var setsEvt = new CustomEvent("LoadSets", {
        detail: {
            items: {}
        }
    });
    document.dispatchEvent(setsEvt)
    var evt = new CustomEvent("PutOnItems", {
        detail: {
            items: items
        }
    });
    document.dispatchEvent(evt)
})

contextBridge.exposeInMainWorld('myAPI', {
    makeRequest: async(req) => {
        return await ipcRenderer.invoke("MakeRequest", req)
    },
    server: () => {
        return configService.server
    }
})
