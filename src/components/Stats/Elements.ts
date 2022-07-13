export const Elements = {
    datePickerInput(): HTMLInputElement {
        return document.getElementById('datePickerInput') as HTMLInputElement
    },
    moneySpan(): HTMLSpanElement {
        return document.getElementById('moneySpan') as HTMLSpanElement
    },
    selectedDayDropDiv(): HTMLDivElement {
        return document.getElementById('selectedDayDropDiv') as HTMLDivElement
    }
}
