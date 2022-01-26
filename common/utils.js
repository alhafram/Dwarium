// TODO: - ???? REFACTOR OR LODASH

String.prototype.toDocument = function() {
    var parser = new DOMParser();
    return parser.parseFromString(this, 'text/html');
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