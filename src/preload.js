require('./polyfill/core.js');
//add any additional polyfills here

const { ipcRenderer } = require('electron');
ipcRenderer.on('navigate', (event, route) => {
	window.location.hash = route;
});

window.addEventListener('DOMContentLoaded', () => {
	//add stuff here
});