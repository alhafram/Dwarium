const TabsController = {
    tabs: {},
    current_tab_id: 'main',
    addTab(id, tab) {
        this.tabs[id] = tab
    },
    deleteTab(id) {
        this.tabs[id] = null
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
    mainWindow: null
}

module.exports = TabsController
