import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { UserConfig } from '../../Models/UserConfig'
import UserConfigService from '../../services/UserConfigService'

async function getUserId() {
    return (await ipcRenderer.invoke(Channel.GET_ID)) as number
}

function getUserConfig(id: number) {
    return UserConfigService.get(id)
}

function save(userConfig: UserConfig) {
    ipcRenderer.send(Channel.FOOD_CHANGED)
    UserConfigService.save(userConfig)
}

async function loadItemsData(types: string[]) {
    return await ipcRenderer.invoke('LoadSetItems', types)
}

Array.prototype.removeItem = function(element) {
    var index = this.indexOf(element)
    if(index != -1) {
        this.splice(index, 1)
    }
    return this
}

Array.prototype.removeItems = function(elements) {
    for(var element of elements) {
        var index = this.indexOf(element)
        if(index != -1) {
            this.splice(index, 1)
        }
    }
    return this
}

export default {
    getUserId,
    getUserConfig,
    save,
    loadItemsData
}
