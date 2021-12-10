const {
    ipcRenderer
} = require("electron")

ipcRenderer.on('getAllItems', (event, items) => {
    var evt = new CustomEvent("AttachDND", {detail: {
        items: items
    }});
    document.dispatchEvent(evt)
})

ipcRenderer.on('getWearedItems', (event, items) => {
    var setsEvt = new CustomEvent("LoadSets", {detail: {
        items: {}
    }});
    document.dispatchEvent(setsEvt)
    var evt = new CustomEvent("PutOnItems", {detail: {
        items: items
    }});
    document.dispatchEvent(evt)
})


window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('MakeRequest', (evt) => {
        ipcRenderer.send("MakeRequest", evt.detail)
    })
});
