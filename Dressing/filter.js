let filters = new Set()

function setupFilters() {

    document.querySelector("#i_gray").onchange = function(e) {
        if(!this.checked) {
            filters.add(0)
        } else {
            filters.delete(0)
        }
        filterCurrentItems()
    }

    document.querySelector("#i_green").onchange = function(e) {
        if(!this.checked) {
            filters.add(1)
        } else {
            filters.delete(1)
        }
        filterCurrentItems()
    }

    document.querySelector("#i_blue").onchange = function(e) {
        if(!this.checked) {
            filters.add(2)
        } else {
            filters.delete(2)
        }
        filterCurrentItems()
    }

    document.querySelector("#i_purple").onchange = function(e) {
        if(!this.checked) {
            filters.add(3)
        } else {
            filters.delete(3)
        }
        filterCurrentItems()
    }

    document.querySelector("#i_red").onchange = function(e) {
        if(!this.checked) {
            filters.add(4)
        } else {
            filters.delete(4)
        }
        filterCurrentItems()
    }
}
