export const Elements = {
    notesDiv(): HTMLDivElement {
        return document.getElementById('notesDiv') as HTMLDivElement
    },
    newNoteButton(): HTMLInputElement {
        return document.getElementById('newNoteButton') as HTMLInputElement
    },
    removeNoteDiv(): HTMLButtonElement {
        return document.getElementById('removeNoteDiv') as HTMLButtonElement
    },
    editorTextarea(): HTMLTextAreaElement {
        return document.getElementById('editorTextarea') as HTMLTextAreaElement
    },
    basketIcon(): HTMLElement {
        return document.getElementById('basketIcon') as HTMLElement
    }
}