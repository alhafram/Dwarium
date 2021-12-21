const {
    ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#button-1').addEventListener('click', () => {
        if(document.querySelector('#button-1 > div.knobs').getAttribute('server') == 'W1') {
            document.querySelector('#button-1 > div.knobs').setAttribute('server','W2')
            ipcRenderer.send('load_url', 'w2')
        } else {
            document.querySelector('#button-1 > div.knobs').setAttribute('server', 'W1')
            ipcRenderer.send('load_url', 'w1')
        }
    })
    document.querySelector('#reload_button').addEventListener('click', () => {
        ipcRenderer.send('reload')
    })
    document.querySelector('#dressing_room_button').addEventListener('click', () => {
        ipcRenderer.send('open_dressing_room')
    })
    document.addEventListener('new_tab', (evt) => {
        ipcRenderer.send('new_tab', evt.detail.id)
    })
    document.addEventListener('make_active', (evt) => {
        ipcRenderer.send('make_active', evt.detail.id)
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send('goUrl', evt.detail)
    })
})

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

function createNewTab() {
    let buttons = Array.from(document.querySelector('body > div.tab').children)
    buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')
    const new_tab = document.createElement('a')
    new_tab.textContent = 'New tab'
    new_tab.id = generateRandomId()
    new_tab.className += 'ab active'
    new_tab.onclick = makeActive
    document.querySelector('body > div.tab').insertBefore(new_tab, document.querySelector('#new_tab'))
    return new_tab
}

function makeActive(evt) {
    if(evt.currentTarget.className.includes('active')) {
        return
    }
    let buttons = Array.from(document.querySelector('body > div.tab').children)
    buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')
    evt.currentTarget.className += ' active';
    ipcRenderer.send('make_active', evt.currentTarget.id)
}

ipcRenderer.on('server', (event, server) => {
    if(!server) {
        // Default - W2
        document.querySelector('#button-1 .checkbox').checked = true
        document.querySelector('#button-1').click()
        ipcRenderer.send('load_url', 'w2')
    } else {
        ipcRenderer.send('load_url', server)
        if(server == 'w2') {
            document.querySelector('#button-1 .checkbox').checked = true
            document.querySelector('#button-1').click()
        }
    }
})

ipcRenderer.on('url', (event, url, id) => {
    document.querySelector('.effect-10').disabled = id == 'main'
    document.querySelector('.effect-10').value = url
})

ipcRenderer.on('new_tab', (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send('new_tab', tab.id, url)
})

ipcRenderer.on('close_tab', (evt, id) => {
    let tabs = Array.from(document.querySelector('body > div.tab').children).filter(t => t.tagName == 'A')
    let current_tab = tabs.filter(t => t.id == id)[0]
    if(current_tab) {
        document.querySelector('body > div.tab').removeChild(current_tab)
        ipcRenderer.send('remove_view', id)
        tabs[0].click()
    }
})
