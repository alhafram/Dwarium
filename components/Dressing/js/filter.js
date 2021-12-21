let filters = new Set()

function setupFilters() {

    let filterTypes = {
        'i_gray': 0,
        'i_green': 1,
        'i_blue': 2,
        'i_purple': 3,
        'i_red': 4
    }
    for(const key in filterTypes) {
        document.querySelector(`#${key}`).onchange = function(e) {
            if(!this.checked) {
                filters.add(filterTypes[key])
            } else {
                filters.delete(filterTypes[key])
            }
            filterCurrentItems()
        }
    }
}

function filterWithResettingArmorType() {
    if(state.armorTypeSelected) {
        document.getElementById(`${state.armorTypeSelected}${state.armorTypeSlotSelected ?? ""}Box`).style.border = ''
        state.armorTypeSelected = null
        state.armorTypeSlotSelected = null
        filterCurrentItems()
    }
}

function filterCurrentItems() {
    let items = Array.from(document.querySelector('.currentItems').children)
    items.forEach(i => {
        if(state.armorTypeSelected) {
            if(i.getAttribute('type') == state.armorTypeSelected) {
                i.style.display = 'inline-block'
            } else {
                i.style.display = 'none'
            }
        } else {
            i.style.display = 'inline-block'
        }
        if(state.currentStyle) {
            if(i.getAttribute('trend') == 'Универсал' && i.style.display == 'inline-block' || state.currentStyle == i.getAttribute('trend') && i.style.display == 'inline-block') {
                i.style.display = 'inline-block'
            } else {
                i.style.display = 'none'
            }
        }
        for(var filter of filters) {
            let items = Array.from(document.querySelector('.currentItems').children).filter(e => e.getAttribute('quality') == filter)
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    })
}