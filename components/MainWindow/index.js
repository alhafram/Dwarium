window.addEventListener('DOMContentLoaded', () => {
    const urlBar = document.querySelector('.effect-10')
    urlBar.addEventListener('keyup', (e) => {
        if(e.keyCode == 13) {
            document.dispatchEvent(new CustomEvent('goUrl', {
                detail: urlBar.value
            }))
        }
    })
})

function makeActive(evt) {
    if(evt.currentTarget.className.includes('active')) {
        return
    }
    let buttons = Array.from(document.querySelector('body > div.tabs').children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')
    let id = evt.currentTarget.id
    evt.currentTarget.className += ' active'
    document.dispatchEvent(new CustomEvent('make_active', {
        detail: {
            id: id
        }
    }))
    evt.stopPropagation()
}

function closeTab(evt) {
    document.dispatchEvent(new CustomEvent('close_tab', {
        detail: {
            id: evt.currentTarget.parentElement.id
        }
    }))
    evt.stopPropagation()
}

function addTab() {
    let buttons = Array.from(document.querySelector('body > div.tabs').children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')

    const new_tab = document.createElement('div')
    new_tab.className += 'ab active'
    const id = 'tab_' + (buttons.length - 1)
    new_tab.id = id
    new_tab.onclick = makeActive

    const mainA = document.createElement('a')
    mainA.textContent = 'New tab'
    mainA.className = 'test'
    
    const closeA = document.createElement('a')
    closeA.className = 'close'
    closeA.onclick = closeTab

    new_tab.appendChild(mainA)
    new_tab.appendChild(closeA)
    document.querySelector('body > div.tabs').insertBefore(new_tab, document.querySelector('#new_tab'))
    document.dispatchEvent(new CustomEvent('new_tab', {
        detail: {
            id: id
        }
    }))
}
