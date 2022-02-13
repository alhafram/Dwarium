import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'
import buildPath, { ConfigPath } from '../Models/ConfigPathes'
import { FavouriteLink } from '../Models/FavouriteLink'
import FileHandler from './FileOperationsService'

const path = buildPath(ConfigPath.FAVOURITE_LIST)

function saveFavouriteLink(title: string, url: string, value: boolean | null): void {
    const links = getLinks()
    const favouriteLink = {
        title,
        url
    } as FavouriteLink
    if(value) {
        links.push(favouriteLink)
    } else {
        const index = links.findIndex(link => link.url == url && link.title == title)
        if(index != -1) {
            links.splice(index, 1)
        }
    }
    FileHandler.writeData(path, JSON.stringify(links))
    ipcRenderer.send(Channel.FAVOURITE_UPDATED)
}

function getLinks(): FavouriteLink[] {
    let links = (FileHandler.parseData(path) ?? []) as FavouriteLink[]
    if(Object.keys(links).length == 0) {
        links = []
    }
    return links
}

function isFavouriteLink(url: string): boolean {
    const links = getLinks()
    return links.find(link => link.url == url) != undefined
}

export default {
    saveFavouriteLink,
    isFavouriteLink,
    getLinks
}
