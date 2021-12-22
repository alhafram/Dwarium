window.addEventListener('DOMContentLoaded', () => {
    const urlBar = document.querySelector('.effect-10')
    urlBar.addEventListener('keyup', (e) => {
        if(e.keyCode == 13) {
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
