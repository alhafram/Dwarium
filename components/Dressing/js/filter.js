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
    if(armorTypeSelected) {
        document.getElementById(armorTypeSelected + 'Box').style.border = ''
        armorTypeSelected = null
        filterCurrentItems()
    }
}

function filterCurrentItems() {
    let items = Array.from(document.querySelector('.currentItems').children)
    items.forEach(i => {
        if(armorTypeSelected) {
            if(i.attributes.type.value == armorTypeSelected) {
                i.style.display = 'inline-block'
            } else {
                i.style.display = 'none'
            }
        } else {
            i.style.display = 'inline-block'
        }
        if(state.currentStyle) {
            if(i.attributes.trend.value == 'Универсал' && i.style.display == 'inline-block' || state.currentStyle == i.attributes.trend.value && i.style.display == 'inline-block') {
                i.style.display = 'inline-block'
            } else {
                i.style.display = 'none'
            }
        }
        for(var filter of filters) {
            let items = Array.from(document.querySelector('.currentItems').children).filter(e => e.attributes.quality.value == filter)
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    })
}