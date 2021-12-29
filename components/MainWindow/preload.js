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
    document.querySelector('#belt_button').addEventListener('click', () => {
        ipcRenderer.send('open_belt_room')
    })
    document.querySelector('#chat_log_button').addEventListener('click', () => {
        ipcRenderer.send('chat_log')
    })
    document.querySelector('#chat_settings_button').addEventListener('click', () => {
        ipcRenderer.send('chat_settings')
    })
    document.addEventListener('new_tab', (evt) => {
        const tab = createNewTab()
        ipcRenderer.send('new_tab', tab.id)
    })
    document.addEventListener('make_active', (evt) => {
        makeActive(evt)
        ipcRenderer.send('make_active', evt.detail.id)
    })
    document.addEventListener('close_tab', (evt) => {
        ipcRenderer.send('close_tab', evt.detail.id)
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send('goUrl', evt.detail)
    })
    document.addEventListener('setupMain', () => {
        createNewTab('main', 'Main')
    })
})

function createNewTab(id, title) {
    let buttons = Array.from(document.querySelector('body > div.tabs').children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')

    const new_tab = document.createElement('div')
    new_tab.className += 'ab active'
    if(!id) {
        id = 'tab_' + (buttons.length - 1)
    }
    new_tab.id = id
    new_tab.onclick = makeActive

    const mainA = document.createElement('a')
    mainA.textContent = title ?? 'New tab'
    new_tab.appendChild(mainA)

    if(id != 'main') {
        const closeA = document.createElement('a')
        closeA.className = 'close'
        closeA.onclick = closeTab
        new_tab.appendChild(closeA)
    }
    document.querySelector('body > div.tabs').insertBefore(new_tab, document.querySelector('#new_tab'))
    return new_tab
}

function makeActive(evt) {
    let buttons = Array.from(document.querySelector('body > div.tabs').children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')
    let id = evt.currentTarget.id
    evt.currentTarget.className += ' active'
    ipcRenderer.send('make_active', id)
    evt.stopPropagation()
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

function closeTab(evt) {
    ipcRenderer.send('close_tab', evt.currentTarget.parentElement.id)
    evt.stopPropagation()
}

ipcRenderer.on('url', (event, url, id) => {
    document.querySelector('.effect-10').disabled = id == 'main'
    document.querySelector('.effect-10').value = url
})

ipcRenderer.on('new_tab', (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send('new_tab', tab.id, url)
})

ipcRenderer.on('close_tab', (evt, id) => {
    let tabs = Array.from(document.querySelector('body > div.tabs').children)
    tabs.pop()
    let current_tab = tabs.filter(t => t.id == id)[0]
    if(current_tab) {
        document.querySelector('body > div.tabs').removeChild(current_tab)
        ipcRenderer.send('remove_view', id)
        tabs[0].click()
    }
})

ipcRenderer.on('auth', (evt, auth) => {
    document.querySelector("#dressing_room_button").style.display = auth ? 'block' : 'none'
    document.querySelector("#belt_button").style.display = auth ? 'block' : 'none'
})