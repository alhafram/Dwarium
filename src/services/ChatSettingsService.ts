import { app } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import { ChatSettingsConfig } from '../Models/ChatSettingsConfig'

const userConfigsFolderPath = path.join(app.getPath ('userData'), 'users')

if(!fs.existsSync(userConfigsFolderPath)) {
    fs.mkdirSync(userConfigsFolderPath)
}

function get(id: number): ChatSettingsConfig {
    const filePath = path.join(userConfigsFolderPath, `ChatConfig_${id}.json`)
    if(!fs.existsSync(filePath)) {
        const newChatSettingsConfig: ChatSettingsConfig = {
            autoResponderEnabled: false,
            floodingEnabled: false,
            inactiveTimer: 0,
        
            privateChatResponse: "",
            commonChatResponse: "",
            tradeChatResponse: "",
            groupChatResponse: "",
            clanChatResponse: "",
            allianceChatResponse: "",
        
            commonChatFloodingMessage: "",
            commonChatFloodingTimer: 10,
            tradeChatFloodingMessage: "",
            tradeChatFloodingTimer: 10,
            groupChatFloodingMessage: "",
            groupChatFloodingTimer: 10,
            clanChatFloodingMessage: "",
            clanChatFloodingTimer: 10,
            allianceChatFloodingMessage: "",
            allianceChatFloodingTimer: 10
        }
        save(newChatSettingsConfig, id)
    }
    const chatSettingsConfig = readData(filePath)
    return chatSettingsConfig
}

function save(userConfig: ChatSettingsConfig, id: number): void {
    const filePath = path.join(userConfigsFolderPath, `ChatConfig_${id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(userConfig))
}

function readData(configPath: string): any {
    return parseData(configPath)
}

function parseData(filePath: fs.PathLike): any {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (error) {
        return defaultData
    }
}

export default {
    get,
    save
}