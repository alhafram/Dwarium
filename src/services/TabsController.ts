import { BrowserView, BrowserWindow } from 'electron'
import MainWindowContainer from '../Components/MainWindow/MainWindow'

interface Tab {
    [key: string]: BrowserView
}

export class TabsController {
    static tabs: Tab = {}
    static current_tab_id = 'main'
    static mainWindow: BrowserWindow | null
    static mainWindowContainer: MainWindowContainer | null
    static addTab(id: string, tab: BrowserView): void {
        this.tabs[id] = tab
    }
    static deleteTab(id: string): void {
        if(!this.tabs[id]?.webContents.isDestroyed()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.tabs[id].webContents as any).destroy()
        }
        delete this.tabs[id]
    }
    static setupMain(tab: BrowserView): void {
        this.tabs['main'] = tab
    }
    static getMain(): BrowserView {
        return this.tabs['main']
    }
    static setupCurrent(id: string): void {
        this.current_tab_id = id
    }
    static currentTab(): BrowserView {
        return this.tabs[this.current_tab_id]
    }
    static onlyMain(): boolean {
        const tabIds = Object.keys(this.tabs)
        return tabIds.length == 1 && tabIds[0] == 'main'
    }
}
