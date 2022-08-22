export const Elements = {
    hpDiv(): HTMLDivElement {
        return document.getElementById('hpDiv') as HTMLDivElement
    },
    hpBg(): Element {
        return document.getElementById('hpBg') as Element
    },
    mpBg(): Element {
        return document.getElementById('mpBg') as Element
    },
    mpDiv(): HTMLDivElement {
        return document.getElementById('mpDiv') as HTMLDivElement
    },
    hpIconSvg(): HTMLElement {
        return document.getElementById('hpIconSvg') as HTMLElement
    },
    mpIconSvg(): HTMLElement {
        return document.getElementById('mpIconSvg') as HTMLElement
    },
    hpPercentageP(): HTMLSelectElement {
        return document.getElementById('hpPercentageP') as HTMLSelectElement
    },
    mpPercentageP(): HTMLSelectElement {
        return document.getElementById('mpPercentageP') as HTMLSelectElement
    },
    allFoodDiv(): HTMLDivElement {
        return document.getElementById('allFoodDiv') as HTMLDivElement
    },
    saveButton(): HTMLButtonElement {
        return document.getElementById('saveButton') as HTMLButtonElement
    },
    hpMinusButton(): HTMLButtonElement {
        return document.getElementById('hpMinusButton') as HTMLButtonElement
    },
    hpPlusButton(): HTMLButtonElement {
        return document.getElementById('hpPlusButton') as HTMLButtonElement
    },
    mpMinusButton(): HTMLButtonElement {
        return document.getElementById('mpMinusButton') as HTMLButtonElement
    },
    mpPlusButton(): HTMLButtonElement {
        return document.getElementById('mpPlusButton') as HTMLButtonElement
    }
}
