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
