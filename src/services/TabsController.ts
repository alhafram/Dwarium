import { BrowserView, BrowserWindow } from 'electron'
import MainWindowContainer from '../Components/MainWindow/MainWindow'

interface Tab {
    [key: string]: BrowserView
}

export class TabsController {
    static tabs: Tab = {}
    static tabsList: string[] = []
    static current_tab_id = 'main'
    static mainWindow: BrowserWindow | null
    static mainWindowContainer: MainWindowContainer | null
    static addTab(id: string, tab: BrowserView): void {
        this.tabs[id] = tab
        this.tabsList.push(id)
    }
    static deleteTab(id: string): void {
        if(!this.tabs[id]?.webContents.isDestroyed()) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.tabs[id].webContents as any).destroy()
        }
        const index = this.tabsList.indexOf(id)
        this.tabsList.splice(index, 1)
        delete this.tabs[id]
    }
    static setupMain(tab: BrowserView): void {
        this.tabs['main'] = tab
        if(!this.tabsList.find((tab) => tab == 'main')) {
            this.tabsList.push('main')
        }
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
