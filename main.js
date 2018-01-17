const {
    Menu,
    app,
    BrowserWindow,
    dialog
} = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode.
const {appUpdater} = require('./autoupdater');
var config = require('./config');
var configUrl = "";

config.getUrl.then(function(url) {
    configUrl = url;
    win.loadURL(url);
}).catch(function(err) {
    console.log("Error in loading url", err);
});


/* Handling squirrel.windows events on windows
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
	app.quit();
}


// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}

let win;

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false
        }
    });

//     const menuTemplate = [
//     {
//         label: 'Info',
//         submenu: [
//             {
//                 label: 'About ...',
//                  click () {require('electron').shell.openExternal('http://storeking.in/') }
//             }
//         ]
//     },
//     {
//         role: 'window',
//         submenu: [
//           {role: 'minimize'},
//           {role: 'close'}
//         ]
//     }
// ];
    // const menu = Menu.buildFromTemplate(menuTemplate);

    // Menu.setApplicationMenu(menu);

    win.maximize(true);

    let contents = win.webContents

    contents.once('did-frame-finish-load', () => {
        const checkOS = isWindowsOrmacOS();
        if (checkOS && !isDev) {
          // Initate auto-updates on macOs and windows
          appUpdater();
        }});

        
    contents.webContents.on('did-finish-load', function() {
        let scriptCode = "";
        var scriptUrl = configUrl + "/myscript.js";
        scriptCode += "if(!document.getElementById('skScript')){";
        scriptCode += "var s = document.createElement('script');";
        scriptCode += "s.src = \"" + scriptUrl + "\";";
        scriptCode += "document.head.appendChild(s);";
        scriptCode += "}";
        win.webContents.executeJavaScript(scriptCode);
    });

    win.on('closed', () => {
        win = null
    });
}
