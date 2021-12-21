// TODO: - ???? REFACTOR OR LODASH
Array.prototype.isEmpty = function() {
    return this.length == 0
}

String.prototype.hashCode = function(seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed
    for(let i = 0, ch; i < this.length; i++) {
        ch = this.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

String.prototype.toDocument = function() {
    var parser = new DOMParser();
    return parser.parseFromString(this, 'text/html');
}

function isExists(element) {
    return element !== null && element !== undefined
}

HTMLCollection.prototype.toArray = function() {
    return Array.from(this)
}

Array.prototype.first = function() {
    return this[0]
}

Array.prototype.unique = function() {
    return Array.from(new Set(this))
}

Array.prototype.removeItem = function(element) {
    var index = this.indexOf(element)
    if(index != -1) {
        this.splice(index, 1)
    }
    return this
}

Array.prototype.removeItems = function(elements) {
    for(var element of elements) {
        var index = this.indexOf(element)
        if(index != -1) {
            this.splice(index, 1)
        }
    }
    return this
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

function parseMagicSchools(result) {
    let doc = result.toDocument()
    let schools = Array.from(doc.querySelector('body > table > tbody > tr:nth-child(2) > td.bgg > table > tbody > tr:nth-child(1) > td:nth-child(2) > select').children).map(e => e.textContent)
    let currentStyle = difference(SetStyleHelper.magmarSchools, schools)
    if(currentStyle == 0) {
        currentStyle = difference(SetStyleHelper.humanSchools, schools)
    }
    return Array.from(currentStyle)[0]
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for(let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}