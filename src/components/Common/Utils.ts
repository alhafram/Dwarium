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

export default {
    getUserId,
    getUserConfig,
    save,
    loadItemsData
}
