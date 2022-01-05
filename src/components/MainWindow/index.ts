window.addEventListener('DOMContentLoaded', () => {
    const urlBar = document.querySelector('.urlBarField') as HTMLInputElement
    urlBar.addEventListener('keyup', (e: KeyboardEvent) => {
        if(e.key == 'Enter') {
            document.dispatchEvent(new CustomEvent('goUrl', {
                detail: urlBar.value
            }))
        }
    })
    document.dispatchEvent(new Event('setupMain'))
})

function addTab() {
    document.dispatchEvent(new Event('new_tab'))
}
