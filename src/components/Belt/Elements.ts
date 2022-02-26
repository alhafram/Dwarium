export const Elements = {
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
    },
    warningSpan(): HTMLSpanElement {
        return document.getElementById('warningSpan') as HTMLSpanElement
    },
    potionStaticBoxesDiv(): HTMLElement {
        return document.getElementById('potionStaticBoxesDiv') as HTMLElement
    },
    potionDivs(): HTMLElement[] {
        return document.getElementsByClassName('potion') as unknown as HTMLElement[]
    }
}
