import fs from 'fs'

function parseData(filePath: fs.PathLike): unknown {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (error) {
        return defaultData
    }
}

function writeData(path: fs.PathLike, data: string): void {
    fs.writeFileSync(path, data)
}

function deleteFile(path: fs.PathLike): void {
    fs.unlinkSync(path)
}

function checkFolder(path: fs.PathLike): void {
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

function fileExists(path: fs.PathLike): boolean {
    return fs.existsSync(path)
}

function createFile(path: fs.PathLike): void {
    fs.openSync(path, 'w')
}

function createWriteStream(path: fs.PathLike): fs.WriteStream {
    return fs.createWriteStream(path, {
        flags: 'a'
    })
}

function writeFile(path: fs.PathLike, data: Buffer, callback: () => void) {
    fs.writeFile(path, data, () => {
        callback()
    })
}

function createReadStream(path: fs.PathLike): fs.ReadStream {
    return fs.createReadStream(path)
}

function truncate(path: fs.PathLike): void {
    fs.truncateSync(path, 0)
}

export default {
    parseData,
    writeData,
    deleteFile,
    checkFolder,
    fileExists,
    createFile,
    createWriteStream,
    writeFile,
    createReadStream,
    truncate
}
