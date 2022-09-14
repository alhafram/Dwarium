export const Elements = {
    energyItemsDiv(): HTMLDivElement {
        return document.getElementById('energyItemsDiv') as HTMLDivElement
    },
    purchaseButtons(): HTMLButtonElement[] {
        return Array.from(Elements.energyItemsDiv().children) as HTMLButtonElement[]
    }
}
