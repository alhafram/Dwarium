import fs from 'fs'

function parseData(filePath: fs.PathLike): unknown {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (error) {
        return defaultData
    }
}

function writeData(path: fs.PathLike, data: string) {
    fs.writeFileSync(path, data)
}

export default {
    parseData,
    writeData
}