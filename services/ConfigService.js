const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'config.json')

let server = readData('server')

function writeData(key, value) {
    let contents = parseData(filePath)
    contents[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(contents));
}

function readData(key, value) {
    let contents = parseData(filePath)
    return contents[key]
}

function parseData(filePath) {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        return defaultData;
    }
}

module.exports = {
    server,
    writeData,
    readData,
    parseData
}
