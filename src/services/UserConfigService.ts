import { app } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import { UserConfig } from '../Models/UserConfig'

const userConfigsFolderPath = path.join(app.getPath('userData'), 'users')

if(!fs.existsSync(userConfigsFolderPath)) {
    fs.mkdirSync(userConfigsFolderPath)
}

function get(id: number): UserConfig {
    const filePath = path.join(userConfigsFolderPath, `${id}.json`)
    if(!fs.existsSync(filePath)) {
        const newUserConfig: UserConfig = {
            id: id,
            hpFood: null,
            mpFood: null,
            sets: [],
            beltSets: []
        }
        save(newUserConfig)
    }
    const userConfig = readData(id.toString(), filePath)
    return userConfig
}

function save(userConfig: UserConfig): void {
    const filePath = path.join(userConfigsFolderPath, `${userConfig.id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(userConfig))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readData(key: string, configPath: string): any {
    return parseData(configPath)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
