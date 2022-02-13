import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'
import buildPath, { ConfigPath } from '../Models/ConfigPathes'
import { FavouriteLink } from '../Models/FavouriteLink'
import FileOperationsService from './FileOperationsService'

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
    FileOperationsService.writeData(path, JSON.stringify(links))
    ipcRenderer.send(Channel.FAVOURITE_UPDATED)
}

function getLinks(): FavouriteLink[] {
    let links = (FileOperationsService.parseData(path) ?? []) as FavouriteLink[]
    if(Object.keys(links).length == 0) {
        links = []
    }
    // Release 2.2.0 Remove
    if(Object.keys(links).length > 0 && Object.keys(links)[0] != '0') {
        FileOperationsService.deleteFile(path)
        Object.keys(links).forEach(key => {
            const favouriteLink = {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                title: links[key].title,
                url: key
            } as FavouriteLink
            saveFavouriteLink(favouriteLink.title, favouriteLink.url, true)
        })
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
