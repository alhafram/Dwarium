const {
    ipcRenderer
} = require("electron");

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
});
