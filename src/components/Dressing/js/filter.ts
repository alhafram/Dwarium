let dressingFilters = new Set<number>()

function setupFilters(state: { armorTypeSelected: string | null; currentStyle: string | null; armorTypeSlotSelected: string | null }) {

    interface Filter {
        [key: string]: number;
    }

    const filterTypes: Filter = {
        'i_gray': 0,
        'i_green': 1,
        'i_blue': 2,
        'i_purple': 3,
        'i_red': 4
    }
    for(const key in filterTypes) {
        const element = document.getElementById(key)! as HTMLInputElement
        element.onchange = function(e) {
            if(!element.checked) {
                const filter = filterTypes[key]
                dressingFilters.add(filter) //.add(filter as number)
            } else {
                dressingFilters.delete(filterTypes[key])
            }
            filterCurrentItems(state)
        }
    }
}

function filterWithResettingArmorType(state: { armorTypeSelected: string | null; currentStyle: string | null; armorTypeSlotSelected: string | null }) {
    if(state.armorTypeSelected) {
        document.getElementById(`${state.armorTypeSelected}${state.armorTypeSlotSelected ?? ""}Box`)!.style.border = ''
        state.armorTypeSelected = null
        state.armorTypeSlotSelected = null
        filterCurrentItems(state)
    }
}

function filterCurrentItems(state: { armorTypeSelected: string | null; currentStyle: string | null; }) {
    let items = Array.from(document.querySelector('.currentItems')!.children)
    items.forEach(i => {
        if(state.armorTypeSelected) {
            if((i as HTMLElement).getAttribute('type') == state.armorTypeSelected) {
                (i as HTMLElement).style.display = 'inline-block'
            } else {
                (i as HTMLElement).style.display = 'none'
            }
        } else {
            (i as HTMLElement).style.display = 'inline-block'
        }
        if(state.currentStyle) {
            if(i.getAttribute('trend') == 'Универсал' && (i as HTMLElement).style.display == 'inline-block' || state.currentStyle == i.getAttribute('trend') && (i as HTMLElement).style.display == 'inline-block') {
                (i as HTMLElement).style.display = 'inline-block'
            } else {
                (i as HTMLElement).style.display = 'none'
            }
        }
        for(var filter of filters) {
            let items = Array.from(document.querySelector('.currentItems')!.children).filter(e => e.getAttribute('quality') == filter)
            items.forEach(item => {
                (item as HTMLElement).style.display = 'none'
            })
        }
    })
}