Array.prototype.isEmpty = function() {
    return this.length == 0
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

function isExists(element) {
    return element !== null && element !== undefined
}

HTMLCollection.prototype.toArray = function() {
    return Array.from(this)
}

Array.prototype.first = function() {
    return this[0]
}

Array.prototype.unique = function () {
    return Array.from(new Set(this))
};
