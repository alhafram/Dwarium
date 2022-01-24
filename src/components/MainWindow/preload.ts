import { ipcRenderer } from 'electron'
import configService from '../../services/ConfigService'
import { Channel } from '../../Models/Channel'
import { generateRandomId } from '../../components/Utils'

let switcher: HTMLElement | null
let tabs: HTMLElement | null

const Elements = {
    usernameBox(): HTMLInputElement {
        return document.getElementById('username') as HTMLInputElement
    },
    userPrvBox(): HTMLButtonElement {
        return document.getElementById('prvUserButton') as HTMLButtonElement
    },
    findEffectsBox(): HTMLButtonElement {
        return document.getElementById('findEffects') as HTMLButtonElement
    },
    notesBox(): HTMLButtonElement {
        return document.getElementById('notes') as HTMLButtonElement
    },
    screenshotBox(): HTMLButtonElement {
        return document.getElementById('screenshot') as HTMLButtonElement
    },
    foodBox(): HTMLButtonElement {
        return document.getElementById('food') as HTMLButtonElement
    }
}

window.addEventListener('DOMContentLoaded', () => {
    switcher = document.querySelector('#switcher') as HTMLElement
    tabs = document.querySelector('body > div.tabs')

    switcher.addEventListener('click', () => {
        const knob = document.querySelector('#switcher > div.knob')
        if(knob?.getAttribute('server') == 'W1') {
            knob.setAttribute('server','W2')
            ipcRenderer.send(Channel.LOAD_URL, 'w2')
        } else {
            knob?.setAttribute('server', 'W1')
            ipcRenderer.send(Channel.LOAD_URL, 'w1')
        }
    })
    document.getElementById('reloadButton')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.RELOAD)
    })
    document.getElementById('backButton')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.BACK)
    })
    document.getElementById('forwardButton')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.FORWARD)
    })
    document.getElementById('dressingRoom')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_DRESSING_ROOM)
    })
    document.getElementById('beltPotionRoom')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_BELT_POTION_ROOM)
    })
    document.getElementById('chatLog')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_CHAT_LOG)
    })
    document.getElementById('chatSettings')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_CHAT_SETTINGS)
    })
    document.getElementById('settings')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_SETTINGS)
    })
    document.addEventListener('new_tab', (evt) => {
        const tab = createNewTab()
        ipcRenderer.send(Channel.NEW_TAB, tab.id)
    })
    document.addEventListener('make_active', (evt) => {
        makeActive(evt)
        ipcRenderer.send(Channel.MAKE_ACTIVE, (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('close_tab', (evt) => {
        ipcRenderer.send(Channel.CLOSE_TAB, (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send(Channel.GO_URL, (<CustomEvent>evt).detail)
    })
    document.addEventListener('setupMain', () => {
        createNewTab('main', 'Main')
    })
    document.getElementById('updateApplication')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.UPDATE_APPLICATION)
    })
    document.getElementById('findCharacter')?.addEventListener('click', () => {
        const nick = Elements.usernameBox().value
        if(nick.length != 0) {
            if(configService.windowOpenNewTab()) {
                const tab = createNewTab()
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${configService.baseUrl()}/user_info.php?nick=${nick}`)
            } else {
                ipcRenderer.send(Channel.FIND_CHARACTER, nick)
            }
        }
    })
    Elements.usernameBox().onkeyup = function(e) {
        if(e.key == 'Enter') {
            document.getElementById('findCharacter')?.click()
        }
    }
    Elements.userPrvBox().onclick = function() {
        const nick = Elements.usernameBox().value
        if(nick.length > 0) {
            ipcRenderer.send(Channel.USER_PRV, nick)
        }
    }
    Elements.findEffectsBox().onclick = function() {
        const nick = Elements.usernameBox().value
        if(nick.length > 0) {
            if(configService.windowOpenNewTab()) {
                const tab = createNewTab()
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${configService.baseUrl()}/effect_info.php?nick=${nick}`)
            } else {
                ipcRenderer.send(Channel.FIND_EFFECTS, nick)
            }
        }
    }
    Elements.notesBox().onclick = function() {
        ipcRenderer.send(Channel.OPEN_NOTES)
    }
    Elements.screenshotBox().onclick = function() {
        ipcRenderer.send(Channel.TAKE_SCREENSHOT)
    }
    Elements.foodBox().onclick = function() {
        ipcRenderer.send(Channel.OPEN_FOOD)
    }
})

function createNewTab(id?: string, title?: string) {
    let buttons = Array.from(tabs!.children)
    buttons = buttons.filter(b => b.className.includes('ab'))
    buttons.forEach(b => b.className = 'ab')

    const new_tab = document.createElement('div')
    new_tab.className += 'ab active'
    if(!id) {
        id = generateRandomId()
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
    ipcRenderer.send(Channel.MAKE_ACTIVE, id)
    evt.stopPropagation()
}

ipcRenderer.on(Channel.SERVER, (event, server) => {
    const switcherChekbox = document.querySelector('#switcher .checkbox') as HTMLInputElement
    if(!server) {
        // Default - W2
        switcherChekbox.checked = true
        switcher?.click()
        ipcRenderer.send(Channel.LOAD_URL, 'w2')
    } else {
        ipcRenderer.send(Channel.LOAD_URL, server)
        if(server == 'w2') {
            switcherChekbox.checked = true
            switcher?.click()
        }
    }
})

function closeTab(evt: Event) {
    const parentElement = (evt.currentTarget as HTMLElement).parentElement?.id
    ipcRenderer.send(Channel.CLOSE_TAB, parentElement)
    evt.stopPropagation()
}

ipcRenderer.on(Channel.URL, (event, url, id) => {
    const urlBarField = document.querySelector('.urlBarField') as HTMLInputElement
    urlBarField.disabled = id == 'main'
    urlBarField.value = url
})

ipcRenderer.on(Channel.FINISH_LOAD_URL, (event, id, title) => {
    let element = document.getElementById(id)?.firstElementChild as HTMLLinkElement
    if(element) {
        element.textContent = title
    }
})

ipcRenderer.on(Channel.NEW_TAB, (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send(Channel.NEW_TAB, tab.id, url)
})

ipcRenderer.on(Channel.CLOSE_TAB, (evt, id) => {
    let currentTabs = Array.from(tabs!.children)
    currentTabs.pop()
    let current_tab = currentTabs.filter(t => t.id == id)[0]
    if(current_tab) {
        tabs?.removeChild(current_tab);
        (currentTabs[0] as HTMLElement).click()
        ipcRenderer.send(Channel.REMOVE_VIEW, id)
    }
})

ipcRenderer.on(Channel.UPDATE_APPLICATION_AVAILABLE, () => {
    const updateApplicationStyle = document.getElementById('updateApplication')?.style
    updateApplicationStyle?.setProperty('display', 'block')
})

ipcRenderer.on(Channel.OPEN_WINDOW, (_evt, id, active) => {
    const element = document.getElementById(id)
    element!.style.backgroundColor = active ? '#999' : 'white'
})

ipcRenderer.on(Channel.TAKE_SCREENSHOT, () => {
    ipcRenderer.send(Channel.TAKE_SCREENSHOT)
})