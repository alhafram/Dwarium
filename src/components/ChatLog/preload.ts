/* eslint-disable @typescript-eslint/ban-ts-comment */
import readline from 'readline'
import { buildFolderPath, buildPathWithBase, ConfigPath, Folder } from '../../Models/ConfigPathes'
import setupMode from '../../services/DarkModeHandler'
import FileOperationsService from '../../services/FileOperationsService'
import { Elements } from './Elements'
import Utils from '../Common/Utils'

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

function filterLog() {
    if(!calendar) {
        return
    }
    selectDay(calendar.selectedDay, filters, Elements.searchTextBox().value)
}

let calendar: any

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

function setupCalendar() {
    const today = new Date()
    let year = today.getFullYear()
    let month = today.getMonth()
    const monthTag = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let day = today.getDate()
    const days = document.getElementsByTagName('td')
    let selectedDay: Date | null = null
    let daysLen = days.length

    class Calendar {
        selectedDay: Date | null
        constructor() {
            this.selectedDay = selectedDay
            this.draw()
        }
        draw() {
            this.drawDays()
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const that = this,
                reset = document.getElementById('reset'),
                pre = document.getElementById('pre-button'),
                next = document.getElementById('next-button')

            pre?.addEventListener('click', function() {
                that.preMonth()
            })
            next?.addEventListener('click', function() {
                that.nextMonth()
            })
            reset!.addEventListener('click', function() {
                that.reset()
            })
            while(daysLen--) {
                days[daysLen].addEventListener('click', function() {
                    that.clickDay(this)
                })
            }
        }
        drawHeader(e: string | number) {
            const headDay = document.getElementById('head-day'),
                headMonth = document.getElementById('head-month')
            // @ts-ignore
            e ? (headDay.innerHTML = e) : (headDay[0].innerHTML = day)
            headMonth!.innerHTML = monthTag[month] + ' - ' + year
        }
        drawDays() {
            const startDay = new Date(year, month, 1).getDay(),
                nDays = new Date(year, month + 1, 0).getDate()
            let n = startDay
            for(let k = 0; k < 42; k++) {
                days[k].innerHTML = ''
                days[k].id = ''
                days[k].className = ''
            }

            for(let i = 1; i <= nDays; i++) {
                // @ts-ignore
                days[n].innerHTML = i
                n++
            }

            for(let j = 0; j < 42; j++) {
                if(days[j].innerHTML === '') {
                    days[j].id = 'disabled'
                } else if(j === day + startDay - 1) {
                    if(month === today.getMonth() && year === today.getFullYear()) {
                        this.drawHeader(day)
                        days[j].id = 'today'
                        this.clickDay(days[j])
                    }
                }
                if(selectedDay) {
                    if(j === selectedDay.getDate() + startDay - 1 && month === selectedDay.getMonth() && year === selectedDay.getFullYear()) {
                        days[j].className = 'selected'
                        this.drawHeader(selectedDay.getDate())
                    }
                }
            }
        }
        clickDay(o: HTMLTableCellElement) {
            const selected = document.getElementsByClassName('selected'),
                len = selected.length
            if(len !== 0) {
                selected[0].className = ''
            }
            o.className = 'selected'
            // @ts-ignore
            selectedDay = new Date(year, month, o.innerHTML)
            this.drawHeader(o.innerHTML)
            if(this.selectedDay?.getTime() != selectedDay.getTime()) {
                this.selectedDay = selectedDay
                // @ts-ignore Function in index.js
                filterLog()
            }
        }
        preMonth() {
            if(month < 1) {
                month = 11
                year = year - 1
            } else {
                month = month - 1
            }
            this.drawHeader(1)
            this.drawDays()
        }
        nextMonth() {
            if(month >= 11) {
                month = 0
                year = year + 1
            } else {
                month = month + 1
            }
            this.drawHeader(1)
            this.drawDays()
        }
        reset() {
            month = today.getMonth()
            year = today.getFullYear()
            day = today.getDate()
            this.drawDays()
        }
    }
    calendar = new Calendar()
}
