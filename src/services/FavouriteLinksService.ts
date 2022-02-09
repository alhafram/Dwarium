const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import { ipcRenderer } from 'electron'
import fs from 'fs'
import path from 'path'
import { Channel } from '../Models/Channel'
import { FavouriteLink } from '../Models/FavouriteLink'

const configPath = path.join(app.getPath('userData'), 'favouriteLinks.json')

function saveFavouriteLink(title: string, path: string, value: boolean | null): void {
    let contents = parseData(configPath)
    if(value) {
        contents[path] = {
            title
        }
    } else {
        contents[path] = null
    }
    Object.keys(contents).forEach(key => {
        if(contents[key] === null) {
            delete contents[key]
        }
    })
    fs.writeFileSync(configPath, JSON.stringify(contents))
    ipcRenderer.send(Channel.FAVOURITE_UPDATED)
}

function getLinks(): FavouriteLink[] {
    const links = parseData(configPath)
    return Object.keys(links).map(key => {
        return {
            url: key,
            title: links[key].title
        }
    })
}

function isFavouriteLink(path: string): boolean {
    let contents = parseData(configPath)
    return contents[path] ?? false
}

function parseData(filePath: fs.PathLike): any {
    const defaultData = {}
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } catch (error) {
        return defaultData
    }
}

export default {
    saveFavouriteLink,
    isFavouriteLink,
    getLinks
}