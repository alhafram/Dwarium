export const SetElements = {
    setTitleInput(): HTMLInputElement {
        return document.getElementById('setTitleInput') as HTMLInputElement
    },
    saveSetButton(): HTMLInputElement {
        return document.getElementById('saveSetButton') as HTMLInputElement
    },
    equipSetButton(): HTMLButtonElement {
        return document.getElementById('equipSetButton') as HTMLButtonElement
    },
    unequipButton(): HTMLButtonElement {
        return document.getElementById('unequipButton') as HTMLButtonElement
    },
    allItemsDiv(): HTMLDivElement {
        return document.getElementById('allItemsDiv') as HTMLDivElement
    }
}

export function disableButtons(disabled: boolean) {
    SetElements.saveSetButton().disabled = disabled
    SetElements.equipSetButton().disabled = disabled
    SetElements.unequipButton().disabled = disabled
}