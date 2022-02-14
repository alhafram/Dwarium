import { buildFolderPath, buildPathWithBase, Folder } from '../Models/ConfigPathes'
import { UserConfig } from '../Models/UserConfig'
import FileOperationsService from './FileOperationsService'

const folderPath = buildFolderPath(Folder.USERS)
FileOperationsService.checkFolder(folderPath)

function get(id: number): UserConfig {
    const filePath = buildPathWithBase(folderPath, `${id}.json`)
    if(!FileOperationsService.fileExists(filePath)) {
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
    const filePath = buildPathWithBase(folderPath, `${userConfig.id}.json`)
    FileOperationsService.writeData(filePath, JSON.stringify(userConfig))
}

function readData(key: string, configPath: string): any {
    return FileOperationsService.parseData(configPath)
}

export default {
    get,
    save
}
