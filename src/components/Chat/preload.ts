import { app } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
const logsFolderPath = path.join(app.getPath('userData'), 'logs')
const filePath = path.join(logsFolderPath, 'chat.log')

async function processLineByLine() {

    if(!fs.existsSync(logsFolderPath)) {
        fs.mkdirSync(logsFolderPath)
        fs.openSync(filePath, 'w')
    } else if(!fs.existsSync(filePath)) {
        fs.openSync(filePath, 'w')
    }

    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    for await (const line of rl) {
        let elem = document.createElementFromString(line)
        if(elem) {
            document.querySelector("body > div.messageLogs")?.appendChild(elem)
        }
    }
    scrollToBottom()
    fs.watch(filePath, function(eventName, filename) {
        const fileStream1 = fs.createReadStream(filePath)
        const rl1 = readline.createInterface({
            input: fileStream1,
            crlfDelay: Infinity
        })
        let currentLine: string | null
        rl1.on('line', function(line) {
            currentLine = line
        })
        fileStream1.on('end', function() {
            if(!currentLine) {
                let parent = document.querySelector("body > div.messageLogs")!
                let logMessages = Array.from(parent.children)
                for(let logMessage of logMessages) {
                    parent.removeChild(logMessage)
                }
                return
            }
            let elem = document.createElementFromString(currentLine)
            document.querySelector("body > div.messageLogs")?.appendChild(elem)
            filterLog()
        })
    })
}


window.addEventListener('DOMContentLoaded', async () => {
    await processLineByLine()
    filterLog()
    document.getElementById('cleanLogs')?.addEventListener('click', () => {
        fs.truncateSync(filePath, 0)
    })
})

declare global {
    export interface Document {
        createElementFromString(str: string): ChildNode
    }
    export interface Array<T> {
        removeItem(elem: T): T
    }
}

Document.prototype.createElementFromString = function(str: string): ChildNode {
    const element = new DOMParser().parseFromString(str, 'text/html')
    return element.body.firstChild!
}

Array.prototype.removeItem = function(element) {
    var index = this.indexOf(element)
    if(index != -1) {
        this.splice(index, 1)
    }
    return this
}