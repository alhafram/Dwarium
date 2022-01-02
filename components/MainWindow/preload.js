const {
    ipcRenderer
} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#switcher').addEventListener('click', () => {
        if(document.querySelector('#switcher > div.knob').getAttribute('server') == 'W1') {
            document.querySelector('#switcher > div.knob').setAttribute('server','W2')
            ipcRenderer.send('load_url', 'w2')
        } else {
            document.querySelector('#switcher > div.knob').setAttribute('server', 'W1')
            ipcRenderer.send('load_url', 'w1')
        }
    })
    document.getElementById('reloadButton').addEventListener('click', () => {
        ipcRenderer.send('reload')
    })
    document.getElementById('backButton').addEventListener('click', () => {
        ipcRenderer.send('back')
    })
    document.getElementById('forwardButton').addEventListener('click', () => {
        ipcRenderer.send('forward')
    })
    document.getElementById('dressingRoom').addEventListener('click', () => {
        ipcRenderer.send('openDressingRoom')
    })
    document.getElementById('beltPotionRoom').addEventListener('click', () => {
        ipcRenderer.send('openBeltPotionRoom')
    })
    document.getElementById('chatLog').addEventListener('click', () => {
        ipcRenderer.send('openChatLog')
    })
    document.getElementById('chatSettings').addEventListener('click', () => {
        ipcRenderer.send('openChatSettings')
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
    document.getElementById('updateApplication').addEventListener('click', () => {
        ipcRenderer.send('updateApplication')
    })
    document.getElementById('findCharacter').addEventListener('click', () => {
        const nick = document.getElementById('username').value
        if(nick.length != 0) {
            ipcRenderer.send('findCharacter', nick)
        }
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
        document.querySelector('#switcher .checkbox').checked = true
        document.querySelector('#switcher').click()
        ipcRenderer.send('load_url', 'w2')
    } else {
        ipcRenderer.send('load_url', server)
        if(server == 'w2') {
            document.querySelector('#switcher .checkbox').checked = true
            document.querySelector('#switcher').click()
        }
    }
})

function closeTab(evt) {
    ipcRenderer.send('close_tab', evt.currentTarget.parentElement.id)
    evt.stopPropagation()
}

ipcRenderer.on('url', (event, url, id) => {
    document.querySelector('.urlBarField').disabled = id == 'main'
    document.querySelector('.urlBarField').value = url
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
    document.getElementById("dressingRoom").style.display = auth ? 'block' : 'none'
    document.getElementById("beltPotionRoom").style.display = auth ? 'block' : 'none'
})

ipcRenderer.on('updateApplicationAvailable', () => {
    document.getElementById('updateApplication').style.display = 'block'
})

ipcRenderer.on('openWindow', (_evt, id, active) => {
    document.getElementById(id).style.backgroundColor = active ? '#999' : 'white'
})