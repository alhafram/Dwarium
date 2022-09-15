export const Elements = {
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
