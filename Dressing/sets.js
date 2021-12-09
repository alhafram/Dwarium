let setsState = {
    sets: null,
    currentSet: {
        id: null,
        items: null
    }
}

document.addEventListener("LoadSets", event => {
    let sets = Object.keys(localStorage).filter(key => key.startsWith("set_"))
    console.log(sets)
    // if(Object.keys(event.detail.items).length == 0) {
    if(sets.length == 0) {

    } else {
        for(var set of sets) {
            let article = document.createElement('article')
            article.id = "defaultSet"
            article.className = "leaderboard__profile"

            let img = document.createElement("img")
            img.src = "https://cdn-icons-png.flaticon.com/512/599/599502.png"
            img.className = "leaderboard__picture"
            article.appendChild(img)

            let span = document.createElement("span")
            span.className = "leaderboard__name"
            span.textContent = "Default set"
            article.appendChild(span)
            document.querySelector(".sets").appendChild(article)
        }
        setsState.currentSet.id = sets[0]
    }
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#currentSetTitle").addEventListener('change', e => {
        document.querySelector("#defaultSet span").textContent = e.target.value
    })

    document.querySelector("#addSetButton").addEventListener('click', e => {
        let needToDeselectElements = Array.from(document.querySelector(".sets").children).filter(i => i.id != "addSetButton")
        for(var element of needToDeselectElements) {
            console.log("DESELECTED")
            element.className = "leaderboard__profile"
        }
        let article = document.createElement('article')
        article.id = "defaultSet"
        article.className = "leaderboard__profile  active"
        article.draggable = 'true'

        article.onclick = function(e) {
            console.log("CLICk")
        }

        let img = document.createElement("img")
        img.src = "https://cdn-icons-png.flaticon.com/512/599/599502.png"
        img.className = "leaderboard__picture"
        article.appendChild(img)

        let span = document.createElement("span")
        span.className = "leaderboard__name"
        span.textContent = "Default set"
        article.appendChild(span)

        setsState.currentSet.id = "set_0"
        document.querySelector(".sets").insertBefore(article, document.querySelector(".sets").firstElementChild.nextSibling)
    })
})

function saveSet(e) {
    let ids = Object.keys(state).map(key => state[key].item).filter(item => item != undefined).map(item => item.attributes.itemid.value)
    setsState.currentSet.items = ids
    localStorage.setItem(setsState.currentSet.id, ids)
    console.log("SAVE")
}
