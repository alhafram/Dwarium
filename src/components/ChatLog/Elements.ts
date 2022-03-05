export const Elements = {
    privateCheckBox(): HTMLInputElement {
        return document.getElementById('private') as HTMLInputElement
    },
    commonCheckBox(): HTMLInputElement {
        return document.getElementById('common') as HTMLInputElement
    },
    systemCheckBox(): HTMLInputElement {
        return document.getElementById('system') as HTMLInputElement
    },
    tradeCheckBox(): HTMLInputElement {
        return document.getElementById('trade') as HTMLInputElement
    },
    clanCheckBox(): HTMLInputElement {
        return document.getElementById('clan') as HTMLInputElement
    },
    allianceCheckBox(): HTMLInputElement {
        return document.getElementById('alliance') as HTMLInputElement
    },
    groupCheckBox(): HTMLInputElement {
        return document.getElementById('group') as HTMLInputElement
    },
    cleanLogsBox(): HTMLButtonElement {
        return document.getElementById('cleanLogs') as HTMLButtonElement
    },
    searchTextBox(): HTMLInputElement {
        return document.getElementById('searchText') as HTMLInputElement
    },
    searchButton(): HTMLButtonElement {
        return document.getElementById('searchButton') as HTMLButtonElement
    },
    messageLogsDiv(): HTMLDivElement {
        return document.getElementById('messageLogsDiv') as HTMLDivElement
    }
}
