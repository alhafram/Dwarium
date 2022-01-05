var filters = []

function filterLog() {
    document.querySelector('.messageLogs').children.toArray().forEach(a => a.style.display = 'none')
    let messageDivs = document.querySelector('.messageLogs').children.toArray()
    for(let filter of filters) {
        if(filter != 'cml_spc') {
            let filteredDivs = messageDivs.filter(a => a.firstElementChild?.className == filter)
            filteredDivs.forEach(a => a.style.display = 'block')
        } else {
            let filteredDivs = messageDivs.filter(a => a.className == filter)
            filteredDivs.forEach(a => a.style.display = 'block')
        }
    }
    if(filters.isEmpty()) {
        document.querySelector('.messageLogs').children.toArray().forEach(a => a.style.display = 'block')
    }
    let visibleSpans = document.querySelectorAll('.msgtxt').toArray().filter(span => span.parentElement.style.display == 'block')
    let searchText = document.querySelector('#searchText').value
    if(searchText.startsWith('!')) {
        let allCommand = searchText.slice(1, searchText.length)
        let splittedCommand = allCommand.split('=')
        let command = splittedCommand[0]
        let value = splittedCommand[1] ?? ""
        if(command == 'nick' && value.length > 0) {
            visibleSpans.forEach(span => {
                if(span.parentElement.getAttribute('nick').toLocaleLowerCase() != value.toLocaleLowerCase()) {
                    span.parentElement.style.display = 'none'
                }
            })
        }
    } else {
        visibleSpans.forEach(span => {
            if(!span.innerText.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
                span.parentElement.style.display = 'none'
            }
        })
    }
}

function scrollToBottom() {
    var element = document.getElementsByClassName('messageLogs')
    element[0].scrollTop = element[0].scrollHeight;
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#private').onchange = function(e) {
        this.checked ? filters.push('cml_prv') : filters.removeItem('cml_prv')
        filterLog()
    }
    document.querySelector('#common').onchange = function(e) {
        this.checked ? filters.push('cml_loc') : filters.removeItem('cml_loc')
        filterLog()
    }
    document.querySelector('#system').onchange = function(e) {
        this.checked ? filters.push('cml_spc') : filters.removeItem('cml_spc')
        filterLog()
    }
    document.querySelector('#trade').onchange = function(e) {
        this.checked ? filters.push('cml_trd') : filters.removeItem('cml_trd')
        filterLog()
    }
    document.querySelector('#clan').onchange = function(e) {
        this.checked ? filters.push('cml_cln') : filters.removeItem('cml_cln')
        filterLog()
    }
    document.querySelector('#alliance').onchange = function(e) {
        this.checked ? filters.push('cml_all') : filters.removeItem('cml_all')
        filterLog()
    }
    document.querySelector('#group').onchange = function(e) {
        this.checked ? filters.push('cml_pty') : filters.removeItem('cml_pty')
        filterLog()
    }
})
