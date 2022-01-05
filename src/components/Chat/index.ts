var filters: string[] = []

function filterLog() {
    Array.from(document.querySelector('.messageLogs')?.children!).forEach(a => (a as HTMLElement).style.display = 'none')
    let messageDivs = Array.from(document.querySelector('.messageLogs')!.children)
    for(let filter of filters) {
        if(filter != 'cml_spc') {
            let filteredDivs = messageDivs.filter(a => a.firstElementChild?.className == filter)
            filteredDivs.forEach(a => (a as HTMLElement).style.display = 'block')
        } else {
            let filteredDivs = messageDivs.filter(a => a.className == filter)
            filteredDivs.forEach(a => (a as HTMLElement).style.display = 'block')
        }
    }
    if(filters.length == 0) {
        Array.from(document.querySelector('.messageLogs')!.children).forEach(a => (a as HTMLElement).style.display = 'block')
    }
    let visibleSpans = Array.from(document.querySelectorAll('.msgtxt')).filter(span => span.parentElement!.style.display == 'block')
    let searchText = (document.querySelector('#searchText') as HTMLInputElement).value
    if(searchText.startsWith('!')) {
        let allCommand = searchText.slice(1, searchText.length)
        let splittedCommand = allCommand.split('=')
        let command = splittedCommand[0]
        let value = splittedCommand[1] ?? ""
        if(command == 'nick' && value.length > 0) {
            visibleSpans.forEach(span => {
                if(span.parentElement!.getAttribute('nick')!.toLocaleLowerCase() != value.toLocaleLowerCase()) {
                    span.parentElement!.style.display = 'none'
                }
            })
        }
    } else {
        visibleSpans.forEach(span => {
            if(!(span as HTMLElement).innerText.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                span.parentElement!.style.display = 'none'
            }
        })
    }
}

function scrollToBottom() {
    var element = document.getElementsByClassName('messageLogs')
    element[0].scrollTop = element[0].scrollHeight;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('private')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_prv') : filters.removeItem('cml_prv')
        filterLog()
    }
    document.getElementById('common')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_loc') : filters.removeItem('cml_loc')
        filterLog()
    }
    document.getElementById('system')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_spc') : filters.removeItem('cml_spc')
        filterLog()
    }
    document.getElementById('trade')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_trd') : filters.removeItem('cml_trd')
        filterLog()
    }
    document.getElementById('clan')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_cln') : filters.removeItem('cml_cln')
        filterLog()
    }
    document.getElementById('alliance')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_all') : filters.removeItem('cml_all')
        filterLog()
    }
    document.getElementById('group')!.onchange = function() {
        (this as HTMLInputElement).checked ? filters.push('cml_pty') : filters.removeItem('cml_pty')
        filterLog()
    }
})