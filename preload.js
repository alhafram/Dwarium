const {
    ipcRenderer
} = require("electron")

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#button-1").addEventListener("click", () => {
        if(document.querySelector("#button-1 > div.knobs").attributes.server.value == "W1") {
            document.querySelector("#button-1 > div.knobs").attributes.server.value = "W2"
            ipcRenderer.send("load_url", "w2")
        } else {
            document.querySelector("#button-1 > div.knobs").attributes.server.value = "W1"
            ipcRenderer.send("load_url", "w1")
        }
    })
    document.querySelector("#reload_button").addEventListener("click", () => {
        ipcRenderer.send("reload")
    })
    document.addEventListener('new_tab', (evt) => {
        ipcRenderer.send("new_tab", evt.detail.id)
    })
    document.addEventListener('make_active', (evt) => {
        ipcRenderer.send("make_active", evt.detail.id)
    })
});

ipcRenderer.on('start_navigation_with_url', (event, url) => {
    document.querySelector(".effect-10").value = url
})

ipcRenderer.on('server', (event, server) => {
    if(!server) {
        // Default - W2
        document.querySelector("#button-1 .checkbox").checked = true
        document.querySelector("#button-1").click()
        ipcRenderer.send("load_url", "w2")
    } else {
        ipcRenderer.send("load_url", server)
        if(server == 'w2') {
            document.querySelector("#button-1 .checkbox").checked = true
            document.querySelector("#button-1").click()
        }
    }
})

ipcRenderer.on('url', (event, url, id) => {
    document.querySelector(".effect-10").disabled = id == 'main'
    document.querySelector(".effect-10").value = url
})
