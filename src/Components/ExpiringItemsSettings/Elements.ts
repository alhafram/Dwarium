export const Elements = {
    currentItemsDiv(): HTMLDivElement {
        return document.getElementById('currentItemsDiv') as HTMLDivElement
    },
    saveItemsButton(): HTMLButtonElement {
        return document.getElementById('saveItemsButton') as HTMLButtonElement
    },
    searchEffectInput(): HTMLInputElement {
        return document.getElementById('searchEffectInput') as HTMLInputElement
    }
}
