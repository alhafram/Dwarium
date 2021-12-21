const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'config.json')

let server = readData('server')

function sets() {
    let contents = parseData(filePath)
    let keys = Object.keys(contents).filter(key => key.startsWith('set_'))
    return keys.map(key => JSON.parse(contents[key]))
}

function writeData(key, value) {
    let contents = parseData(filePath)
    contents[key] = value
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(filePath, JSON.stringify(contents))
}

function readData(key) {
    let contents = parseData(filePath)
    return contents[key]
}

function parseData(filePath) {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath))
    } catch (error) {
        return defaultData
    }
}

module.exports = {
    server,
    writeData,
    sets
}
