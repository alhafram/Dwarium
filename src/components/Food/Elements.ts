export const Elements = {
    hpBox(): HTMLDivElement {
        return document.getElementById('hp') as HTMLDivElement
    },
    mpBox(): HTMLDivElement {
        return document.getElementById('mp') as HTMLDivElement
    },
    hpSelectBox(): HTMLSelectElement {
        return document.getElementById('hpSelect') as HTMLSelectElement
    },
    mpSelectBox(): HTMLSelectElement {
        return document.getElementById('mpSelect') as HTMLSelectElement
    },
    allFoodBox(): HTMLDivElement {
        return document.getElementsByClassName('allFood')[0] as HTMLDivElement
    },
    saveBox(): HTMLButtonElement {
        return document.getElementById('save') as HTMLButtonElement
    },
    staticBoxes(): HTMLDivElement[] {
        return Array.from(document.querySelectorAll('.staticBox'))
    }
}