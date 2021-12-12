const {
    ipcRenderer,
    contextBridge
} = require("electron")
const {
    Requests
} = require('../services/RequestManager')

require('./utils')

contextBridge.exposeInMainWorld('myAPI', {
    makeRequest: async(req) => {
        return await ipcRenderer.invoke("MakeWebRequest", req)
    },
    server: () => {
        return configService.server
    },
    loadItemsData: async() => {
        return await ipcRenderer.invoke("LoadSetItems")
    },
    loadCurrentMagicSchool: async(zikkuratId) => {
        let currentMagicSchool = await getCurrentMagicSchool(zikkuratId)
        return Array.from(currentMagicSchool)[0]
    },
    saveSet: (set) => {
        console.log("Save set to config: ", set)
    }
})

function difference(setA, setB) {
    let _difference = new Set(setA)
    for(let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

async function getCurrentMagicSchool(zikkuratId) {
    let magmarSchools = ['Огонь', 'Земля', 'Тень']
    let humanSchools = ['Воздух', 'Свет', 'Вода']
    let result = await ipcRenderer.invoke('Fetch', Requests.getMagicSchools, {
        id: zikkuratId
    })
    let doc = result.toDocument()
    let schools = Array.from(doc.querySelector("body > table > tbody > tr:nth-child(2) > td.bgg > table > tbody > tr:nth-child(1) > td:nth-child(2) > select").children).map(e => e.textContent)
    let currentStyle = difference(magmarSchools, schools)
    if(currentStyle == 0) {
        currentStyle = difference(humanSchools, schools)
    }
    return currentStyle
}
