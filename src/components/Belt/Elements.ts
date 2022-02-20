export const Elements = {
    setsDiv(): HTMLDivElement {
        return document.getElementById('setsDiv') as HTMLDivElement
    },
    setTitleBox(): HTMLInputElement {
        return document.getElementById('currentSetTitle') as HTMLInputElement
    },
    saveSetBox(): HTMLInputElement {
        return document.getElementById('save') as HTMLInputElement
    },
    equipSetBox(): HTMLButtonElement {
        return document.getElementById('equip') as HTMLButtonElement
    },
    unequipBox(): HTMLButtonElement {
        return document.getElementById('unequip') as HTMLButtonElement
    },
    allItemsDiv(): HTMLDivElement {
        return document.getElementById('allItemsDiv') as HTMLDivElement
    },
    staticBoxes(): HTMLCollection {
        return document.getElementsByClassName('potion')
    },
    warningBox(): HTMLSpanElement {
        return document.getElementById('warning') as HTMLSpanElement
    },
    notesDiv(): HTMLDivElement {
        return document.getElementById('notesDiv') as HTMLDivElement
    },
    newNoteButton(): HTMLInputElement {
        return document.getElementById('newNoteButton') as HTMLInputElement
    },
    removeNoteDiv(): HTMLButtonElement {
        return document.getElementById('removeNoteDiv') as HTMLButtonElement
    },
    basketIcon(): HTMLElement {
        return document.getElementById('basketIcon') as HTMLElement
    },
    potionStaticBoxesDiv(): HTMLElement {
        return document.getElementById('potionStaticBoxesDiv') as HTMLElement
    },
    potionDivs(): HTMLElement[] {
        return document.getElementsByClassName('potion') as unknown as HTMLElement[]
    }
}
