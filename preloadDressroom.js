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
    var evt = new CustomEvent("PutOnItems", {detail: {
        items: items
    }});
    document.dispatchEvent(evt)
})
