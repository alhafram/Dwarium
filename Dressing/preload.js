const {
    ipcRenderer,
    contextBridge
} = require("electron")
const {
    Requests
} = require('../services/RequestManager')
const configService = require('../services/ConfigService')
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
    },
    setStyleHelper: () => {
        return SetStyleHelper
    }
})

const SetStyleHelper = {
    magmarSchools: ['Огонь', 'Земля', 'Тень'],
    humanSchools: ['Воздух', 'Свет', 'Вода'],
    getStyleId(name) {
        if(name == 'Огонь') {
            return 8
        }
        if(name == 'Воздух') {
            return 1
        }
        if(name == 'Земля') {
            return 16
        }
        if(name == 'Вода') {
            return 2
        }
        if(name == 'Тень') {
            return 32
        }
        if(name == 'Свет') {
            return 4
        }
    },
    getSchool(style, currentSchool) {
        if(SetStyleHelper.magmarSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Огонь'
            }
            if(style == 'Тяжеловес') {
                return 'Земля'
            }
            if(style == 'Ловкач') {
                return 'Тень'
            }
        }
        if(SetStyleHelper.humanSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Воздух'
            }
            if(style == 'Тяжеловес') {
                return 'Вода'
            }
            if(style == 'Ловкач') {
                return 'Свет'
            }
        }
        return null
    }
}

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
    let currentStyle = difference(SetStyleHelper.magmarSchools, schools)
    if(currentStyle == 0) {
        currentStyle = difference(SetStyleHelper.humanSchools, schools)
    }
    return currentStyle
}
