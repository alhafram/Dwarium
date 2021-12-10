let setsState = {
    sets: null,
    currentSet: {
        id: null,
        box: null,
        items: null
    }
}

document.addEventListener("LoadSets", event => {
    let sets = Object.keys(localStorage).filter(key => key.startsWith("set_"))
    // if(Object.keys(event.detail.items).length == 0) {
    if(sets.length == 0) {

    } else {
        for(var set of sets) {
            let jsonSet = JSON.parse(localStorage[set])
            let article = document.createElement('article')

            article.id = set
            article.className = "leaderboard__profile"
            article.onclick = function(e) {
                chooseSet(this)
            }

            let img = document.createElement("img")
            img.src = "https://cdn-icons-png.flaticon.com/512/599/599502.png"
            img.className = "leaderboard__picture"
            article.appendChild(img)

            let span = document.createElement("span")
            span.className = "leaderboard__name"
            span.textContent = jsonSet.title
            article.appendChild(span)
            document.querySelector(".sets").appendChild(article)
        }
        setsState.currentSet.id = sets[0]
    }
})

function chooseSet(element) {
    if(element.className == "leaderboard__profile  active") {
        return
    }
    deselectOtherSets()
    element.className = "leaderboard__profile  active"
    var jsonSet = null
    if(element.id) {
        jsonSet = JSON.parse(localStorage[element.id])
        document.querySelector("#currentSetTitle").value = jsonSet.title
    }

    setsState.currentSet.box = element
    unequipFromSet()
    if(jsonSet) {
        equipFromSet(jsonSet.ids)
    }
}

function equipFromSet(ids) {
    for(var id of ids) {
        let items = Array.from(document.querySelector(".current_items").children)
        let item = items.filter(element => element.attributes.itemid.value == id)[0]
        if(item) {
            state.currentElement = item
            putOnItem(item)
            state.currentElement = null
        } else {
            console.log("SOMETHING WRONG", id)
            return
        }
    }
}

function unequipFromSet() {
    let items = state.getEquipedItems()
    console.log(items)
    for(var item of items) {
        putOffItem(item.parentElement, false, true)
        let copys = Array.from(document.querySelector(".current_items").children).filter(i => i.attributes.copy)
        for(var copy of copys) {
            copy.parentElement.removeChild(copy)
        }
    }
    // console.log(items)
}

function deselectOtherSets() {
    let needToDeselectElements = Array.from(document.querySelector(".sets").children).filter(i => i.id != "addSetButton")
    for(var element of needToDeselectElements) {
        console.log("DESELECTED")
        element.className = "leaderboard__profile"
    }
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#currentSetTitle").addEventListener('change', e => {
        if(!setsState.currentSet.box) {
            return
        }
        setsState.currentSet.box.lastElementChild.textContent = e.target.value
    })

    document.querySelector("#addSetButton").addEventListener('click', e => {
        let sets = Object.keys(localStorage)
        let emptySet = sets.filter(i => JSON.parse(localStorage[i]).ids.length == 0)[0]
        if(emptySet) {
            alert(`Такой набор вещей уже существует: ${JSON.parse(localStorage[emptySet]).title}`)
            return
        }
        deselectOtherSets()
        unequipFromSet()
        let article = document.createElement('article')
        article.className = "leaderboard__profile  active"
        article.draggable = 'true'

        article.onclick = function(e) {
            chooseSet(this)
        }

        let img = document.createElement("img")
        img.src = "https://cdn-icons-png.flaticon.com/512/599/599502.png"
        img.className = "leaderboard__picture"
        article.appendChild(img)

        let span = document.createElement("span")
        span.className = "leaderboard__name"
        span.textContent = "Default set"
        article.appendChild(span)

        setsState.currentSet.box = article
        setsState.currentSet.id = null
        document.querySelector("#currentSetTitle").value = "Default set"
        document.querySelector(".sets").insertBefore(article, document.querySelector(".sets").firstElementChild.nextSibling)
        saveSet()
    })
})

function saveSet(e) {
    if(!setsState.currentSet.box) {
        return
    }
    let items = state.getEquipedItems()
    let title = setsState.currentSet.box.lastElementChild.textContent
    let ids = items.map(i => i.attributes.itemid.value)
    let str = ids.join(';')
    str += title
    var id = null
    if(setsState.currentSet.id) {
        id = setsState.currentSet.id
        localStorage.removeItem(id)
        id = str.hashCode()
        id = "set_" + id
    } else {
        id = str.hashCode()
        id = "set_" + id
    }
    localStorage.setItem(id, JSON.stringify({title: title, ids: Array.from(new Set(ids))}))
    setsState.currentSet.id = id
    setsState.currentSet.box.id = id
}

String.prototype.hashCode = function(seed = 0){
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < this.length; i++) {
        ch = this.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}
