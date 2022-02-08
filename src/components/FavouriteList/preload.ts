import { ipcRenderer } from "electron";
import { Channel } from '../../Models/Channel'

window.addEventListener('DOMContentLoaded', () => {
    handleMode()
})

ipcRenderer.on(Channel.SWITCH_MODE, () => {
    handleMode()
})

function handleMode() {
    if(localStorage.darkMode == 'true') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}