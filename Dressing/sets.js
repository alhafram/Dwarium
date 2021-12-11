class SetManager {
    sets = []
    currentSet = null
    equipedCurrentItemIds = []

    #article = "leaderboard__profile"
    #activeArticle = "leaderboard__profile active"

    get setsBox() {
        return document.querySelector(".sets")
    }

    get setTitleBox() {
        return document.querySelector("#currentSetTitle")
    }

    get allCurrentItems() {
        return document.querySelector(".current_items").children.toArray()
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
            self.addNewSet()
        })
        document.querySelector("#saveSet").addEventListener('click', e => {
            self.saveSet()
        })
        document.querySelector("#unequip").addEventListener('click', e => {
            self.unequip()
        })
        document.querySelector("#equipSet").addEventListener('click', e => {
            self.equipSelectedSet()
        })
    }

    addNewSet() {
        this.deselectOtherArticles()
        this.unequip()
        let id = this.#generateSetId()
        let newSet = {
            id: id,
            title: "Default set",
            ids: []
        }
        let article = this.createSetArticleElement(newSet, true)
        this.setTitleBox.value = "Default set"
        this.setsBox.insertBefore(article, this.setsBox.firstElementChild.nextSibling)
        this.currentSet = newSet
        this.pushSet(newSet)
        this.saveSet()
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
        article.id = set.id
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
        span.textContent = set.title
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
        this.currentSet = selectedSet
        this.equipFromSet(selectedSet.ids)
        this.setTitleBox.value = selectedSet.title
    }

    saveSet() {
        let items = state.getEquipedItems()
        let title = this.setTitleBox.value
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
            id = this.#generateSetId()
        }
        let newSet = {
            id: id,
            title: title,
            ids: ids.unique()
        }
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
        for(var item of items) {
            putOffItem(item.parentElement, isExists(item.attributes.copy), true)
        }
    }

    equipFromSet(ids) {
        for(var id of ids) {
            let item = this.allCurrentItems.filter(element => element.attributes.itemid.value == id).first()
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

    #generateSetId() {
        return "set_" + generateRandomId()
    }

    async equipSelectedSet() {
        if(!isExists(this.currentSet)) {
            return
        }
        while(!this.equipedCurrentItemIds.isEmpty()) {
            let id = this.equipedCurrentItemIds.first()
            await unequipRequest(id)
            this.equipedCurrentItemIds.removeItem(id)
        }
        for(var id of this.currentSet.ids) {
            await equipRequest(id)
            this.equipedCurrentItemIds.push(id)
        }
    }
}
