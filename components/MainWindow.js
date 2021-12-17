const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const configService = require('../services/ConfigService')

class MainWindow extends BrowserWindow {

    browserView = null

    constructor() {
        super({
            width: 1400,
            height: 900,
            title: 'Dwarium',
            icon: __dirname + '/icon.icns',
            webPreferences: {
                sandbox: true,
                preload: path.join(__dirname, "preload.js"),
                backgroundThrottling: false
            },
            useContentSize: true,
            show: false
        })

        this.on('page-title-updated', (evt) => {
            evt.preventDefault();
        });

        this.on('resized', (evt) => {
            this.setContentBounds()
        })
        let win = this
        this.on('closed', function() {
            win = null
        })
    }

    setup() {
        this.browserView = this.createMainBrowserView()
        this.setBrowserView(this.browserView)
        let current_server = configService.server
        this.webContents.send('server', current_server)
    }

    getControlBounds() {
        const contentBounds = this.getContentBounds();
        return {
            x: 0,
            y: 0,
            width: contentBounds.width,
            height: 100
        }
    }

    setContentBounds(tab) {
        const [contentWidth, contentHeight] = this.getContentSize();
        const controlBounds = this.getControlBounds();
        if(tab) {
            tab.setBounds({
                x: 0,
                y: controlBounds.y + controlBounds.height,
                width: contentWidth,
                height: contentHeight - controlBounds.height + 2 // Fix white line
            });
        }
    }

    start() {
        this.show();
        // mainWindow.maximize();
        this.loadFile(`${path.join(app.getAppPath(), 'index.html')}`);
    }

    createMainBrowserView() {
        let browserView = new electron.BrowserView({
            enablePreferredSizeMode: true
        })
        browserView.setBounds(this.getControlBounds())
        browserView.setAutoResize({
            width: true,
            height: true
        })
        // browserView.webContents.openDevTools()
        return browserView
    }
}

module.exports.MainWindow = MainWindow
