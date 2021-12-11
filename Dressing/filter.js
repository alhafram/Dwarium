document.addEventListener("AttachDND", event => {

    document.querySelector("#i_gray").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 0)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }

    document.querySelector("#i_gray").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 0)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }

    document.querySelector("#i_green").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 1)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }

    document.querySelector("#i_blue").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 2)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }

    document.querySelector("#i_purple").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 3)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }

    document.querySelector("#i_red").onchange = function(e) {
        let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == 4)
        if(this.checked) {
            items.forEach(item => {
                item.style.display = 'inline-block'
            })
        } else {
            items.forEach(item => {
                item.style.display = 'none'
            })
        }
    }
})
