import { filterLog } from './preload'

let calendar: any

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


function getCalendar(): any {
    return calendar
}

export {
    setupCalendar,
    getCalendar
}