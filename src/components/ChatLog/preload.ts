import { contextBridge } from 'electron'
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
    date: string,
    logs: string[]
}
var chatLogs: ChatLog[] = []

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

async function loadContent() {
    await processLineByLine()
}
    
function selectDay(day: Date, filters: any[], searchText: string) {
    const foundChatLogs = chatLogs.find(chatLog => chatLog.date == day.getTime().toString())
    if(foundChatLogs) {
        const logsContainer = document.getElementById('messageLogs') as HTMLDivElement
        Array.from(logsContainer.children).forEach(logDiv => {
            logsContainer.removeChild(logDiv)
        })
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
}

function cleanLogs() {
    FileOperationsService.truncate(filePath)
    chatLogs = []
}

var filters: string[] = []

function filterLog() {
    if(!calendar) {
        return
    }
    selectDay(calendar.selectedDay, filters, Elements.searchTextBox().value)
}

var calendar: any

window.addEventListener('DOMContentLoaded', async () => {
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
    var today = new Date(),
        year = today.getFullYear(),
        month = today.getMonth(),
        monthTag = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        day = today.getDate(),
        days = document.getElementsByTagName('td'),
        selectedDay: Date | null = null,
        daysLen = days.length;

    class Calendar {
        selectedDay: Date | null
        constructor() {
            this.selectedDay = selectedDay
            this.draw();
        }
        draw() {
            this.drawDays();
            var that = this,
                reset = document.getElementById('reset'),
                pre = document.getElementById('pre-button'),
                next = document.getElementById('next-button');

            pre?.addEventListener('click', function() {
                that.preMonth();
            });
            next?.addEventListener('click', function() {
                that.nextMonth();
            });
            reset!.addEventListener('click', function() {
                that.reset();
            });
            while(daysLen--) {
                days[daysLen].addEventListener('click', function() {
                    that.clickDay(this);
                });
            }
        }
        drawHeader(e: string | number) {
            var headDay = document.getElementById('head-day'),
                headMonth = document.getElementById('head-month');
            // @ts-ignore
            e ? headDay.innerHTML = e : headDay[0].innerHTML = day;
            headMonth!.innerHTML = monthTag[month] + " - " + year;
        }
        drawDays() {
            var startDay = new Date(year, month, 1).getDay(),
                nDays = new Date(year, month + 1, 0).getDate(),
                n = startDay;
            for(var k = 0; k < 42; k++) {
                days[k].innerHTML = '';
                days[k].id = '';
                days[k].className = '';
            }

            for(var i = 1; i <= nDays; i++) {
                // @ts-ignore
                days[n].innerHTML = i;
                n++;
            }

            for(var j = 0; j < 42; j++) {
                if(days[j].innerHTML === "") {

                    days[j].id = "disabled";

                } else if(j === day + startDay - 1) {
                    if((month === today.getMonth()) && (year === today.getFullYear())) {
                        this.drawHeader(day);
                        days[j].id = "today";
                        this.clickDay(days[j])
                    }
                }
                if(selectedDay) {
                    if((j === selectedDay.getDate() + startDay - 1) && (month === selectedDay.getMonth()) && (year === selectedDay.getFullYear())) {
                        days[j].className = "selected";
                        this.drawHeader(selectedDay.getDate());
                    }
                }
            }
        }
        clickDay(o: HTMLTableCellElement) {
            var selected = document.getElementsByClassName("selected"),
                len = selected.length;
            if(len !== 0) {
                selected[0].className = "";
            }
            o.className = "selected";
            // @ts-ignore
            selectedDay = new Date(year, month, o.innerHTML);
            this.drawHeader(o.innerHTML);
            if(this.selectedDay?.getTime() != selectedDay.getTime()) {
                this.selectedDay = selectedDay
                // @ts-ignore Function in index.js
                filterLog()
            }
        }
        preMonth() {
            if(month < 1) {
                month = 11;
                year = year - 1;
            } else {
                month = month - 1;
            }
            this.drawHeader(1);
            this.drawDays();
        }
        nextMonth() {
            if(month >= 11) {
                month = 0;
                year = year + 1;
            } else {
                month = month + 1;
            }
            this.drawHeader(1);
            this.drawDays();
        }
        reset() {
            month = today.getMonth();
            year = today.getFullYear();
            day = today.getDate();
            this.drawDays();
        }
    }
    calendar = new Calendar();
}