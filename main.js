/*global require*/
/*eslint-env es6*/

// Modules to control application life and create native browser window

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
//const __dirname = 'D:/JamesLaderoute/Documents/Learning/Electron/Projects/sysinfoapp';

let win;    // global ref to window object. If you don't keep a global reference, 
            // the window will be closed automatically when the JavaScript object is
            // garbage collected. (gitup issue #7475)

function createWindow() {
    // create browser window
    win = new BrowserWindow({
        width:1150, 
        height:858,
        title: 'First Example',
        webPreferences: { nodeIntegration:true }
    });
    
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:', 
        slashes: true
    }));
    
    // Open devtools (same as chrome devtools) only when in development
    win.webContents.openDevTools();
    
    // when closing
    win.on('closed', () => {
        // Derefence the window object, usually oyu would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// load it - run create window function
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // on windows this becomes 'win32'; mac==darwin
        app.quit();
    }
});

