window.addEventListener('DOMContentLoaded', () => {
    const urlBar = document.querySelector('.effect-10')
    urlBar.addEventListener('keyup', (e) => {
        if(e.keyCode == 13) {
            document.dispatchEvent(new CustomEvent('goUrl', {
                detail: urlBar.value
            }))
        }
    })
})

function makeActive(evt) {
    if(evt.currentTarget.className.includes('active')) {
        return
    }
    let buttons = Array.from(document.querySelector("body > div.tab").children)
    buttons.filter(b => b.className.includes("ab"))
    buttons.forEach(b => b.className = "ab")
    evt.currentTarget.className += " active";
    document.dispatchEvent(new CustomEvent('make_active', {
        detail: {
            id: evt.currentTarget.id
        }
    }))
}

function addTab() {
    let buttons = Array.from(document.querySelector("body > div.tab").children)
    buttons.filter(b => b.className.includes("ab"))
    buttons.forEach(b => b.className = "ab")
    const new_tab = document.createElement("a")
    const id = "tab_" + (buttons.length - 1)
    new_tab.textContent = "New tab"
    new_tab.id = id
    new_tab.className += "ab active"
    new_tab.onclick = makeActive
    document.querySelector("body > div.tab").insertBefore(new_tab, document.querySelector("#new_tab"))
    document.dispatchEvent(new CustomEvent('new_tab', {
        detail: {
            id: id
        }
    }))
}
