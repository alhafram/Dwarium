import buildPath, { ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.NOTES)

function writeData(key: string, value: any): void {
    const contents = FileOperationsService.parseData(path) as any
    contents[key] = value
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(contents))
}

function notes(): any[] {
    const contents = FileOperationsService.parseData(path) as any
    const keys = Object.keys(contents).filter((key) => key.startsWith('note_'))
    return keys.map((key) => JSON.parse(contents[key]))
}

export default {
    writeData,
    notes
}
