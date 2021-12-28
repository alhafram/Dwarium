var filters = []

function filterLog() {
    document.querySelector('.messageLogs').children.toArray().forEach(a => a.style.display = 'none')
    let messageDivs = document.querySelector('.messageLogs').children.toArray()
    for(let filter of filters) {
        if(filter != 'cml_spc') {
            let filteredDivs = messageDivs.filter(a => a.firstElementChild.className == filter)
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
    visibleSpans.forEach(span => {
        if(!span.innerText.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
            span.parentElement.style.display = 'none'
        }
    })
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
})
