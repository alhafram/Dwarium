const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import fs from 'fs'
import path from 'path'
const configPath = path.join(app.getPath('userData'), 'notes.json')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeData(key: string, value: any): void {
    const contents = parseData(configPath)
    contents[key] = value
    Object.keys(contents).forEach((key) => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notes(): any[] {
    const contents = parseData(configPath)
    const keys = Object.keys(contents).filter((key) => key.startsWith('note_'))
    return keys.map((key) => JSON.parse(contents[key]))
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
    writeData,
    notes
}
