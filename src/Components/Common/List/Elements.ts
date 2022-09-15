export const ListElements = {
    newSetButton(): HTMLInputElement {
        return document.getElementById('newSetButton') as HTMLInputElement
    },
    removeSetDiv(): HTMLButtonElement {
        return document.getElementById('removeSetDiv') as HTMLButtonElement
    },
    basketIcon(): HTMLElement {
        return document.getElementById('basketIcon') as HTMLElement
    },
    setsDiv(): HTMLDivElement {
        return document.getElementById('setsDiv') as HTMLDivElement
    }
}