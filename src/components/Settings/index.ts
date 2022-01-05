let loadedSettings: any

interface Settings {
    key: string;
    value: number;
}

const userAgents = {
    default: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    win10Firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
    win10Opera: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36 OPR/82.0.4227.33',
    macChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    macSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    macFirefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0',
    clientV3: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.152 extopen/1 Client/3.0.105/AuthCheck Safari/537.22',
    clientV4: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Client/4.0.53/AuthCheck Safari/537.36'
}

document.addEventListener('DOMContentLoaded', async () => {
    loadedSettings = window.myAPI.loadSettings()
    setupView()
    setupListeners()
})

function setupListeners() {

    document.getElementById('userAgents')?.addEventListener('change', () => {
        let selectedUserAgent = (document.getElementById('userAgents') as HTMLInputElement).value;
        loadedSettings.userAgentType = selectedUserAgent
        setupUserAgent()
    })

    document.getElementById('save')?.addEventListener('click', () => {
        const userAgentText = (document.getElementById('userAgentText') as HTMLInputElement).value
        if(userAgentText.length == 0) {
            alert('User-Agent не может быть пустым!')
            return
        }
        const userAgentType = (document.getElementById('userAgents') as HTMLInputElement).value
        const windowOpenNewTab = (document.getElementById('windowOpenNewTab') as HTMLInputElement).checked
        const windowsAboveApp = (document.getElementById('windowsAboveApp') as HTMLInputElement).checked
        const maximizeOnStart = (document.getElementById('maximizeOnStart') as HTMLInputElement).checked

        const settings = {
            userAgentType,
            windowOpenNewTab,
            windowsAboveApp,
            userAgentText,
            maximizeOnStart
        }
        window.myAPI.saveSettings(settings)
        if(confirm('Для того что бы настройки вступили в силу, необходимо перезапустить клиент!')) {
            window.myAPI.restart()
        }
    })
}

function setupView() {
    setupCheckboxes()
    setupUserAgent()
}

function setupCheckboxes() {
    (document.getElementById('windowsAboveApp') as HTMLInputElement).checked = loadedSettings?.windowsAboveApp;
    (document.getElementById('windowOpenNewTab') as HTMLInputElement).checked = loadedSettings?.windowOpenNewTab;
    (document.getElementById('maximizeOnStart') as HTMLInputElement).checked = loadedSettings?.maximizeOnStart
}

function setupUserAgent() {
    let selectedUserAgent: string = loadedSettings?.userAgentType ?? 'default';
    (document.getElementById('userAgents') as HTMLInputElement).value = selectedUserAgent
    let userAgentText = ''
    if(selectedUserAgent == 'own') {
        userAgentText = loadedSettings?.userAgentText
    } else {
        // @ts-ignore
        userAgentText = userAgents[selectedUserAgent]
    }
    (document.getElementById('userAgentText') as HTMLInputElement).value = userAgentText;
    (document.getElementById('userAgentText') as HTMLInputElement).disabled = selectedUserAgent != 'own'
}
