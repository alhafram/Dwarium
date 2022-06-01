import { ChatSettingsConfig } from '../Models/ChatSettingsConfig'
import { buildFolderPath, buildPathWithBase, Folder } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const folderPath = buildFolderPath(Folder.USERS)
FileOperationsService.checkFolder(folderPath)

function get(id: number): ChatSettingsConfig {
    const filePath = buildPathWithBase(folderPath, `ChatConfig_${id}.json`)
    if(!FileOperationsService.fileExists(filePath)) {
        const newChatSettingsConfig: ChatSettingsConfig = {
            autoResponderEnabled: false,
            floodingEnabled: false,
            inactiveTimer: 0,

            privateChatResponse: '',
            commonChatResponse: '',
            tradeChatResponse: '',
            groupChatResponse: '',
            clanChatResponse: '',
            allianceChatResponse: '',

            commonChatFloodingMessage: '',
            commonChatFloodingTimer: 10,
            tradeChatFloodingMessage: '',
            tradeChatFloodingTimer: 10,
            groupChatFloodingMessage: '',
            groupChatFloodingTimer: 10,
            clanChatFloodingMessage: '',
            clanChatFloodingTimer: 10,
            allianceChatFloodingMessage: '',
            allianceChatFloodingTimer: 10,

            hideAttackedMessage: false,
            hideEndFightMessage: false,
            hideGiftPetMessage: false,
            hideSocialInvitesMessage: false,
            hideMeridianVaultsMessage: false,
            hideUpgradeMountMessage: false,
            hideContestMessage: false,
            hideGuardiansMessage: false,
            hideChaoticFightMessage: false,
            hideCrusibleFightMessage: false,
            hideHeavenFightMessage: false,
            hideKesariMessage: false,
            hideNewsMessage: false,
            hideEventsMessage: false,
            hideBoxPrizeMessage: false,
            hideMedalsMessage: false,
            hideMentorsMessage: false,
            hideBanditMessage: false,
            hidePitMessage: false
        }
        save(newChatSettingsConfig, id)
    }
    const chatSettingsConfig = readData(filePath)
    return chatSettingsConfig
}

function save(userConfig: ChatSettingsConfig, id: number): void {
    const filePath = buildPathWithBase(folderPath, `ChatConfig_${id}.json`)
    FileOperationsService.writeData(filePath, JSON.stringify(userConfig))
}

function readData(configPath: string): any {
    return FileOperationsService.parseData(configPath)
}

export default {
    get,
    save
}
