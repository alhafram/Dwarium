import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'

document.addEventListener('CloseTab', () => {
    ipcRenderer.send(Channel.CLOSE_URL)
})