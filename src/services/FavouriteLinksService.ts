import { ipcRenderer } from 'electron'
import Utils from '../Components/Common/Utils'
import { Channel } from '../Models/Channel'
import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import { FavouriteLink } from '../Models/FavouriteLink'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.FAVOURITE_LIST)

function saveFavouriteLink(title: string, url: string, value: boolean | null): void {
    const links = getLinks()
    const favouriteLink = {
        title,
        url,
        id: Utils.generateRandomId()
    } as FavouriteLink
    if(value) {
        links.push(favouriteLink)
    } else {
        const index = links.findIndex((link) => link.url == url)
        if(index != -1) {
            links.splice(index, 1)
        }
    }
    FileOperationsService.writeData(path, JSON.stringify(links))
    ipcRenderer.send(Channel.FAVOURITE_UPDATED)
}

function updateTitle(id: string, newTitle: string): void {
    const links = getLinks()
    links.forEach((link) => {
        if(link.id == id) {
            link.title = newTitle
        }
    })
    FileOperationsService.writeData(path, JSON.stringify(links))
    ipcRenderer.send(Channel.FAVOURITE_UPDATED)
}

function getLinks(): FavouriteLink[] {
    let links = (FileOperationsService.parseData(path) ?? []) as FavouriteLink[]
    if(Object.keys(links).length == 0) {
        links = []
    }
    links.forEach((link) => {
        if(!link.id) {
            link.id = Utils.generateRandomId()
        }
    })
    return links
}

function isFavouriteLink(url: string): boolean {
    const links = getLinks()
    return links.find((link) => link.url == url) != undefined
}

export default {
    saveFavouriteLink,
    isFavouriteLink,
    getLinks,
    updateTitle
}
