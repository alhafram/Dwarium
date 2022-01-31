const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import fs from 'fs'
import path from 'path'
const configPath = path.join(app.getPath('userData'), 'notes.json')

function writeData(key: string, value: any): void {
    let contents = parseData(configPath)
    contents[key] = value
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

function notes(): any[] {
    let contents = parseData(configPath)
    let keys = Object.keys(contents).filter(key => key.startsWith('note_'))
    return keys.map(key => JSON.parse(contents[key]))
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
    writeData,
    notes
}