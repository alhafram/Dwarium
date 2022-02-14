const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import path from 'path'

export enum ConfigPath {
    FAVOURITE_LIST = 'favouriteLinks.json',
    CONFIG = 'config.json',
    WINDOW_SIZE = 'windows.json',
    NOTES = 'notes.json'
}

export default function buildPath(config: ConfigPath): string {
    return path.join(app.getPath('userData'), config)
}
