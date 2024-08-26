DEFAULT_WIDTH = 900;
DEFAULT_HEIGHT = 600;

MIN_WIDTH = 450;
MIN_HEIGHT = 400;

QUIT_ON_WINDOW_CLOSED = true

//------------------------------

const { app, BrowserWindow, protocol, shell, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

const {appMenuTemplate, createContextMenuTemplate} = require('./menu');

let mainWindow;

// Open external URLs outside browser
function handleNavigation(event, url) {
	if (url.startsWith('http')) {
		event.preventDefault();
		shell.openExternal(url);
	}
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
		minWidth: MIN_WIDTH,
		minHeight: MIN_HEIGHT,
		
		webPreferences: {
			//preload: path.join(__dirname, 'preload.js'),
			//webSecurity: false,
			//contextIsolation: false,
			//nodeIntegration: true,
		}
	});

	mainWindow.loadURL(url.format({
		pathname: 'index.html',
		protocol: 'file:',
		slashes: true
	}));
	
	mainWindow.webContents.on('will-navigate', handleNavigation);
	mainWindow.webContents.on('new-window', handleNavigation);
}

app.on('ready', () => {
	protocol.interceptFileProtocol('file', (request, callback) => {
		let pathname = decodeURI(url.parse(request.url).pathname);

		if (pathname === "/") {
			pathname = "/index.html";
		}

		const requestPath = path.join(__dirname, 'site', pathname);
		if (fs.existsSync(requestPath)) {
			callback(requestPath);
		} else {
			console.error(`File not found: ${requestPath}`);
			callback({ path: path.join(__dirname, 'site/404.html') });
		}
	});
	
	createWindow();
	
	const appMenu = Menu.buildFromTemplate(appMenuTemplate);
	Menu.setApplicationMenu(appMenu);
	
	mainWindow.webContents.on('context-menu', (event, params) => {
		const contextMenu = Menu.buildFromTemplate(createContextMenuTemplate(params));
		setTimeout(() => {
			contextMenu.popup(mainWindow);
		}, 20); //timeout needed for text to appear highlighted
	});
});

app.on('window-all-closed', () => {
	if (QUIT_ON_WINDOW_CLOSED) {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

module.exports = { createWindow };