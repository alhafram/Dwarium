var filters: string[] = []

function filterLog() {
    if(!calendar) {
        return
    }
    window.chatLogAPI.selectDay(calendar.selectedDay, filters, Elements.searchTextBox().value)
}

const Elements = {
    privateCheckBox(): HTMLInputElement {
        return document.getElementById('private') as HTMLInputElement
    },
    commonCheckBox(): HTMLInputElement {
        return document.getElementById('common') as HTMLInputElement
    },
    systemCheckBox(): HTMLInputElement {
        return document.getElementById('system') as HTMLInputElement
    },
    tradeCheckBox(): HTMLInputElement {
        return document.getElementById('trade') as HTMLInputElement
    },
    clanCheckBox(): HTMLInputElement {
        return document.getElementById('clan') as HTMLInputElement
    },
    allianceCheckBox(): HTMLInputElement {
        return document.getElementById('alliance') as HTMLInputElement
    },
    groupCheckBox(): HTMLInputElement {
        return document.getElementById('group') as HTMLInputElement
    },
    cleanLogsBox(): HTMLButtonElement {
        return document.getElementById('cleanLogs') as HTMLButtonElement
    },
    searchTextBox(): HTMLInputElement {
        return document.getElementById('searchText') as HTMLInputElement
    },
    searchButton(): HTMLButtonElement {
        return document.getElementById('searchButton') as HTMLButtonElement
    }
}

var calendar: any

window.addEventListener('DOMContentLoaded', async () => {
    await window.chatLogAPI.loadContent()
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
        window.chatLogAPI.cleanLogs()
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

export {}