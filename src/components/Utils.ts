import { contextBridge } from 'electron'

export interface UtilsAPI {
    generateRandomId: () => string
}

declare global {
    interface Window {
        utilsAPI: UtilsAPI
    }
    export interface String {
        toDocument(): Document
    }
}

contextBridge.exposeInMainWorld('utilsAPI', {
    generateRandomId: () => {
        return generateRandomId()
    }
})

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

String.prototype.toDocument = function() {
    var parser = new DOMParser();
    return parser.parseFromString(this as string, 'text/html');
}