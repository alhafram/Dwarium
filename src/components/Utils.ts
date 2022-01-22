import { contextBridge } from 'electron'

export interface UtilsAPI {
    generateRandomId: () => string
}

declare global {
    interface Window {
        utilsAPI: UtilsAPI
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