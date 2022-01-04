const TabsController = {
    tabs: {},
    current_tab_id: 'main',
    mainWindow: null,
    addTab(id, tab) {
        this.tabs[id] = tab
    },
    deleteTab(id) {
        this.tabs[id].webContents.destroy()
        delete this.tabs[id]
    },
    setupMain(tab) {
        this.tabs['main'] = tab
    },
    getMain() {
        return this.tabs['main']
    },
    setupCurrent(id) {
        this.current_tab_id = id
    },
    currentTab() {
        return this.tabs[this.current_tab_id]
    },
    onlyMain() {
        let tabIds = Object.keys(this.tabs)
        return tabIds.length == 1 && tabIds[0] == 'main'
    }
}

module.exports = TabsController
