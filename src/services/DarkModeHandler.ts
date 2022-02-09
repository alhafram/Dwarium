import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'

ipcRenderer.on(Channel.SWITCH_MODE, () => {
    setupMode()
})

export default function setupMode() {
    if(localStorage.darkMode == 'true') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}