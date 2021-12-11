class SetManager {
    sets = []
    currentSet = null

    #article = "leaderboard__profile"
    #activeArticle = "leaderboard__profile active"

    get setsBox() {
        return document.querySelector(".sets")
    }

    pushSet(newSet) {
        let set = this.sets.find(e => e.id == newSet.id)
        if(!isExists(set)) {
            this.sets.push(newSet)
        } else {
            this.sets[this.sets.indexOf(set)] = newSet
        }
    }

    setupListeners() {
        let self = this
        document.querySelector("#addSetButton").addEventListener('click', e => {
            this.deselectOtherArticles()
            self.unequip()
            let randomId = (Math.random() + 1).toString(36).substring(2)
            let id = "set_" + randomId
            let newSet = {
                id: id,
                title: "Default set",
                ids: []
            }
            let article = this.createSetArticleElement(null, true)
            document.querySelector("#currentSetTitle").value = "Default set"
            this.setsBox.insertBefore(article, this.setsBox.firstElementChild.nextSibling)
            self.currentSet = newSet
            self.pushSet(newSet)
        })

        document.querySelector("#currentSetTitle").addEventListener('change', e => {
            // TODO
        })
        document.querySelector("#saveSet").addEventListener('click', e => {
            self.saveSet()
        })
        document.querySelector("#unequip").addEventListener('click', e => {
            self.unequip()
        })
    }

    loadSets() {
        const setKeys = Object.keys(localStorage).filter(key => key.startsWith("set_"))
        let sets = setKeys.map(key => JSON.parse(localStorage[key]))
        this.sets = sets
    }

    fillSets() {
        if(!this.sets.isEmpty()) {
            for(var set of this.sets) {
                let article = this.createSetArticleElement(set)
                this.setsBox.appendChild(article)
            }
        }
    }

    createSetArticleElement(set, active) {
        let article = document.createElement('article')
        article.id = isExists(set) ? set.id : "SOME RANDOM ID"
        let className = active ? this.#activeArticle : this.#article
        article.className = className
        var self = this
        article.onclick = function(e) {
            self.selectSet(this)
        }

        let img = document.createElement("img")
        img.src = "https://cdn-icons-png.flaticon.com/512/599/599502.png"
        img.className = "leaderboard__picture"
        article.appendChild(img)

        let span = document.createElement("span")
        span.className = "leaderboard__name"
        span.textContent = isExists(set) ? set.title : "Default set"
        article.appendChild(span)
        return article
    }

    selectSet(element) {
        if(element.className == this.#activeArticle) {
            return
        }
        this.deselectOtherArticles()
        this.unequip()
        element.className = this.#activeArticle
        let selectedSet = this.sets.find(obj => obj.id == element.id)
        if(isExists(selectedSet)) {
            this.currentSet = selectedSet
            this.equipFromSet(selectedSet.ids)
            document.querySelector("#currentSetTitle").value = selectedSet.title
        } else {
            document.querySelector("#currentSetTitle").value = "Default set"
            this.unequip()
        }
    }

    saveSet() {
        let items = state.getEquipedItems()
        let title = document.querySelector("#currentSetTitle").value
        let ids = items.map(i => i.attributes.itemid.value)

        let setArticles = setManager.setsBox.children.toArray()
        let activeSet = setArticles.filter(e => e.id != "addSetButton" && e.className == this.#activeArticle).first()
        let id = null
        var isNew = true
        if(isExists(activeSet) && isExists(this.currentSet)) {
            id = this.currentSet.id
            isNew = false
            activeSet.lastElementChild.textContent = title
        } else {
            let randomId = (Math.random() + 1).toString(36).substring(2)
            id = "set_" + randomId
        }
        let newSet = {
            id: id,
            title: title,
            ids: ids.unique()
        }
        activeSet.id = id
        localStorage.setItem(id, JSON.stringify(newSet))
        this.pushSet(newSet)
        this.currentSet = newSet
        if(isNew) {
            let article = this.createSetArticleElement(newSet, true)
            this.setsBox.insertBefore(article, this.setsBox.firstElementChild.nextSibling)
        }
    }

    deselectOtherArticles() {
        let self = this
        this.setsBox.children.toArray().forEach(e => {
            e.className = self.#article
        })
    }

    unequip() {
        let items = state.getEquipedItems()
        console.log(items)
        for(var item of items) {
            putOffItem(item.parentElement, false, true)
            let copys = Array.from(document.querySelector(".current_items").children).filter(i => i.attributes.copy)
            for(var copy of copys) {
                copy.parentElement.removeChild(copy)
            }
        }
    }

    equipFromSet(ids) {
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
}

let setManager = new SetManager()

document.addEventListener("LoadSets", event => {
    setManager.loadSets()
    setManager.fillSets()
    setManager.setupListeners()
})
