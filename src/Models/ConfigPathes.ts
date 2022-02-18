const { app } = process.type === 'browser' ? require('electron') : require('@electron/remote')
import path from 'path'

enum ConfigPath {
    FAVOURITE_LIST = 'favouriteLinks.json',
    CONFIG = 'config.json',
    WINDOW_SIZE = 'windows.json',
    NOTES = 'notes.json',
    CHAT_LOG = 'chat.log'
}

enum Folder {
    USERS = 'users',
    LOGS = 'logs',
    SCREENS = 'screens'
}

function buildPath(config: ConfigPath): string {
    return path.join(app.getPath('userData'), config)
}

function buildFolderPath(folder: Folder) {
    return path.join(app.getPath('userData'), folder)
}

function buildPathWithBase(basePath: string, name: string): string {
    return path.join(basePath, name)
}

export { buildPath, buildFolderPath, buildPathWithBase, ConfigPath, Folder }
