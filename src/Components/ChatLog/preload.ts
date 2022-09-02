/* eslint-disable @typescript-eslint/ban-ts-comment */
import readline from 'readline'
import { buildFolderPath, buildPathWithBase, ConfigPath, Folder } from '../../Models/ConfigPathes'
import setupMode from '../../Services/DarkModeHandler'
import FileOperationsService from '../../Services/FileOperationsService'
import { Elements } from './Elements'
import Utils from '../Common/Utils'
import { getCalendar, setupCalendar } from './Calendar'

// Hack
Utils.getUserConfig(0)

const folderPath = buildFolderPath(Folder.LOGS)
const filePath = buildPathWithBase(folderPath, ConfigPath.CHAT_LOG)

type ChatLog = {
    date: string
    logs: string[]
}
let chatLogs: ChatLog[] = []

async function processLineByLine() {
    FileOperationsService.checkFolder(folderPath)
    if(!FileOperationsService.fileExists(filePath)) {
        FileOperationsService.createFile(filePath)
    }

    const fileStream = FileOperationsService.createReadStream(filePath)
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
            const foundLog = chatLogs.find((chatLog) => chatLog.date == messageDateTimestamp)
            if(foundLog) {
                const index = chatLogs.indexOf(foundLog)
                const log = chatLogs[index]
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

async function loadContent() {
    await processLineByLine()
}

function selectDay(day: Date, filters: any[], searchText: string) {
    const foundChatLogs = chatLogs.find((chatLog) => chatLog.date == day.getTime().toString())
    if(foundChatLogs) {
        clearMessagesDiv()
        for(const line of foundChatLogs.logs) {
            const elem = document.createElementFromString(line) as HTMLDivElement
            if(searchText.startsWith('!')) {
                const allCommand = searchText.slice(1, searchText.length)
                const splittedCommand = allCommand.split('=')
                const command = splittedCommand[0]
                const value = splittedCommand[1] ?? ''
                if(command == 'nick' && value.length > 0) {
                    if(elem.getAttribute('nick')?.toLocaleLowerCase() == value.toLocaleLowerCase()) {
                        Elements.messageLogsDiv().appendChild(elem)
                        continue
                    }
                }
            }
            if(!elem.innerText.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                continue
            }
            for(const filter of filters) {
                if(filter != 'cml_spc') {
                    if(elem.firstElementChild?.className == filter) {
                        Elements.messageLogsDiv().appendChild(elem)
                    }
                } else {
                    if(elem.className == filter) {
                        Elements.messageLogsDiv().appendChild(elem)
                    }
                }
            }
            if(filters.length == 0) {
                Elements.messageLogsDiv().appendChild(elem)
            }
        }
        document.body.appendChild(Elements.messageLogsDiv())
    } else {
        clearMessagesDiv()
    }
}

function clearMessagesDiv() {
    const logsContainer = Elements.messageLogsDiv()
    Array.from(logsContainer.children).forEach((logDiv) => {
        logsContainer.removeChild(logDiv)
    })
}

function cleanLogs() {
    FileOperationsService.truncate(filePath)
    chatLogs = []
}

const filters: string[] = []

export function filterLog() {
    if(!getCalendar()) {
        return
    }
    selectDay(getCalendar().selectedDay, filters, Elements.searchTextBox().value)
}

window.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    setupCalendar()
    await loadContent()
    filterLog()
    Elements.privateCheckBox().onchange = function() {
        Elements.privateCheckBox().checked ? filters.push('cml_prv') : filters.removeItem('cml_prv')
        filterLog()
    }
    Elements.commonCheckBox().onchange = function() {
        Elements.commonCheckBox().checked ? filters.push('cml_loc') : filters.removeItem('cml_loc')
        filterLog()
    }
    Elements.systemCheckBox().onchange = function() {
        Elements.systemCheckBox().checked ? filters.push('cml_spc') : filters.removeItem('cml_spc')
        filterLog()
    }
    Elements.tradeCheckBox().onchange = function() {
        Elements.tradeCheckBox().checked ? filters.push('cml_trd') : filters.removeItem('cml_trd')
        filterLog()
    }
    Elements.clanCheckBox().onchange = function() {
        Elements.clanCheckBox().checked ? filters.push('cml_cln') : filters.removeItem('cml_cln')
        filterLog()
    }
    Elements.allianceCheckBox().onchange = function() {
        Elements.allianceCheckBox().checked ? filters.push('cml_all') : filters.removeItem('cml_all')
        filterLog()
    }
    Elements.groupCheckBox().onchange = function() {
        Elements.groupCheckBox().checked ? filters.push('cml_pty') : filters.removeItem('cml_pty')
        filterLog()
    }
    Elements.cleanLogsBox().onclick = function() {
        cleanLogs()
        filterLog()
    }
    Elements.searchButton().onclick = function() {
        filterLog()
    }
    Elements.searchTextBox().onkeyup = function(e: KeyboardEvent) {
        if(e.key == 'Enter') {
            filterLog()
        }
    }
})
