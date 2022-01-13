import { app } from '@electron/remote'
import { contextBridge } from 'electron'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
const logsFolderPath = path.join(app.getPath('userData'), 'logs')
const filePath = path.join(logsFolderPath, 'chat.log')

type ChatLog = {
    date: string,
    logs: string[]
}
var chatLogs: ChatLog[] = []

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
        const stime = line.split('"')[11]
        if(stime) {
            const timestamp = parseInt(stime) * 1000
            // @ts-ignore
            const messageDate = new Date(new Date(timestamp).getYear() + 1900, new Date(timestamp).getMonth(), new Date(timestamp).getDate())
            const messageDateTimestamp = messageDate.getTime().toString()
            const foundLog = chatLogs.find(chatLog => chatLog.date == messageDateTimestamp)
            if(foundLog) {
                let index = chatLogs.indexOf(foundLog)
                let log = chatLogs[index]
                log.logs.push(line)
                chatLogs[index] = log
            } else {
                const log: ChatLog = {
                    date: messageDateTimestamp,
                    logs: [line]
                }
                chatLogs.push(log)
            }
        }
    }
}

contextBridge.exposeInMainWorld('chatLogAPI', {
    loadContent: async () => {
        await processLineByLine()
    },
    selectDay: (day: Date, filters: any[], searchText: string) => {
        const foundChatLogs = chatLogs.find(chatLog => chatLog.date == day.getTime().toString())
        const existedLogsContainer = document.getElementById('messageLogs')
        if(existedLogsContainer) {
            existedLogsContainer.remove()
        }
        if(foundChatLogs) {
            const logsContainer = document.createElementFromString('<div id="messageLogs" style="overflow: scroll; height: 95vh"></div>')
            for(const line of foundChatLogs.logs) {
                let elem = document.createElementFromString(line) as HTMLDivElement
                if(searchText.startsWith('!')) {
                    let allCommand = searchText.slice(1, searchText.length)
                    let splittedCommand = allCommand.split('=')
                    let command = splittedCommand[0]
                    let value = splittedCommand[1] ?? ""
                    if(command == 'nick' && value.length > 0) {
                        if(elem.getAttribute('nick')?.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                            logsContainer.appendChild(elem)
                            continue
                        }
                    }
                }
                if(!elem.innerText.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                    continue
                }
                for(let filter of filters) {
                    if(filter != 'cml_spc') {
                        if(elem.firstElementChild?.className == filter) {
                            logsContainer.appendChild(elem)
                        }
                    } else {
                        if(elem.className == filter) {
                            logsContainer.appendChild(elem)
                        }
                    }
                }
                if(filters.length == 0) {
                    logsContainer.appendChild(elem)
                }
            }
            document.body.appendChild(logsContainer)
        }
    },
    cleanLogs: () => {
        fs.truncateSync(filePath, 0)
        chatLogs = []
    }
})

export interface ChatLogAPI {
    loadContent(): void
    selectDay(day: Date, filters: string[], searchText: string): void,
    cleanLogs(): void
}

declare global {
    interface Window {
        chatLogAPI: ChatLogAPI
    }
}

declare global {
    export interface Document {
        createElementFromString(str: string): ChildNode
    }
    export interface Array<T> {
        removeItem(elem: T): T[]
        removeItems(arr: T[]): T[]
    }
}

Document.prototype.createElementFromString = function(str: string): ChildNode {
    const element = new DOMParser().parseFromString(str, 'text/html')
    return element.body.firstChild!
}