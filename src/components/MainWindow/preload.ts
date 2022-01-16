import { ipcRenderer } from 'electron'

let switcher: HTMLElement | null
let tabs: HTMLElement | null

const Elements = {
    usernameBox(): HTMLInputElement {
        return document.getElementById('username') as HTMLInputElement
    }
}

window.addEventListener('DOMContentLoaded', () => {
    switcher = document.querySelector('#switcher') as HTMLElement
    tabs = document.querySelector('body > div.tabs')

    switcher.addEventListener('click', () => {
        const knob = document.querySelector('#switcher > div.knob')
        if(knob?.getAttribute('server') == 'W1') {
            knob.setAttribute('server','W2')
            ipcRenderer.send('load_url', 'w2')
        } else {
            knob?.setAttribute('server', 'W1')
            ipcRenderer.send('load_url', 'w1')
        }
    })
    document.getElementById('reloadButton')?.addEventListener('click', () => {
        ipcRenderer.send('reload')
    })
    document.getElementById('backButton')?.addEventListener('click', () => {
        ipcRenderer.send('back')
    })
    document.getElementById('forwardButton')?.addEventListener('click', () => {
        ipcRenderer.send('forward')
    })
    document.getElementById('dressingRoom')?.addEventListener('click', () => {
        ipcRenderer.send('openDressingRoom')
    })
    document.getElementById('beltPotionRoom')?.addEventListener('click', () => {
        ipcRenderer.send('openBeltPotionRoom')
    })
    document.getElementById('chatLog')?.addEventListener('click', () => {
        ipcRenderer.send('openChatLog')
    })
    document.getElementById('chatSettings')?.addEventListener('click', () => {
        ipcRenderer.send('openChatSettings')
    })
    document.getElementById('settings')?.addEventListener('click', () => {
        ipcRenderer.send('openSettings')
    })
    document.addEventListener('new_tab', (evt) => {
        const tab = createNewTab()
        ipcRenderer.send('new_tab', tab.id)
    })
    document.addEventListener('make_active', (evt) => {
        makeActive(evt)
        ipcRenderer.send('make_active', (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('close_tab', (evt) => {
        ipcRenderer.send('close_tab', (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send('goUrl', (<CustomEvent>evt).detail)
    })
    document.addEventListener('setupMain', () => {
        createNewTab('main', 'Main')
    })
    document.getElementById('updateApplication')?.addEventListener('click', () => {
        ipcRenderer.send('updateApplication')
    })
    document.getElementById('findCharacter')?.addEventListener('click', () => {
        const nick = Elements.usernameBox().value
        if(nick.length != 0) {
            ipcRenderer.send('findCharacter', nick)
        }
    })
    Elements.usernameBox().onkeyup = function(e) {
        if(e.key == 'Enter') {
            document.getElementById('findCharacter')?.click()
        }
    }
    document.getElementById('prvUserButton')?.addEventListener('click', function() {
        const nick = Elements.usernameBox().value
        if(nick.length > 0) {
            ipcRenderer.send('userPrv', nick)
        }
    })
})

function createNewTab(id?: string, title?: string) {
    let buttons = Array.from(tabs!.children)
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
    tabs?.insertBefore(new_tab, document.querySelector('#new_tab'))
    return new_tab
}

function makeActive(evt: Event) {
    let buttons = Array.from(tabs!.children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')
    const target = evt.currentTarget as HTMLElement
    let id = target.id
    target.className += ' active'
    ipcRenderer.send('make_active', id)
    evt.stopPropagation()
}

ipcRenderer.on('server', (event, server) => {
    const switcherChekbox = document.querySelector('#switcher .checkbox') as HTMLInputElement
    if(!server) {
        // Default - W2
        switcherChekbox.checked = true
        switcher?.click()
        ipcRenderer.send('load_url', 'w2')
    } else {
        ipcRenderer.send('load_url', server)
        if(server == 'w2') {
            switcherChekbox.checked = true
            switcher?.click()
        }
    }
})

function closeTab(evt: Event) {
    const parentElement = (evt.currentTarget as HTMLElement).parentElement?.id
    ipcRenderer.send('close_tab', parentElement)
    evt.stopPropagation()
}

ipcRenderer.on('url', (event, url, id) => {
    const urlBarField = document.querySelector('.urlBarField') as HTMLInputElement
    urlBarField.disabled = id == 'main'
    urlBarField.value = url
})

ipcRenderer.on('finishLoadUrl', (event, id, title) => {
    let element = document.getElementById(id)?.firstElementChild as HTMLLinkElement
    element.textContent = title
})

ipcRenderer.on('new_tab', (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send('new_tab', tab.id, url)
})

ipcRenderer.on('close_tab', (evt, id) => {
    let currentTabs = Array.from(tabs!.children)
    currentTabs.pop()
    let current_tab = currentTabs.filter(t => t.id == id)[0]
    if(current_tab) {
        tabs?.removeChild(current_tab);
        (currentTabs[0] as HTMLElement).click()
        ipcRenderer.send('remove_view', id)
    }
})

ipcRenderer.on('auth', (evt, auth) => {
    const dressingRoomStyle = document.getElementById("dressingRoom")?.style
    dressingRoomStyle?.setProperty('display', auth ? 'block' : 'none')
    const beltPotionRoomStyle = document.getElementById("beltPotionRoom")?.style
    beltPotionRoomStyle?.setProperty('display', auth ? 'block' : 'none')
})

ipcRenderer.on('updateApplicationAvailable', () => {
    const updateApplicationStyle = document.getElementById('updateApplication')?.style
    updateApplicationStyle?.setProperty('display', 'block')
})

ipcRenderer.on('openWindow', (_evt, id, active) => {
    const element = document.getElementById(id)
    element!.style.backgroundColor = active ? '#999' : 'white'
})