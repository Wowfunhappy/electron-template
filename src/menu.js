const { shell, app } = require('electron');

const appMenuTemplate = [
	{
		label: app.name,
		submenu: [
			{role: 'about'},
			{/*-------------------------*/  type: 'separator'},
			{role: 'services', submenu: []},
			{/*-------------------------*/  type: 'separator'},
			{role: 'hide'},
			{role: 'hideothers'},
			{role: 'unhide'},
			{/*-------------------------*/  type: 'separator'},
			{role: 'quit' }
		]
	},
	{
		label: 'File',
		submenu: [
			{
				label: 'New Window',
				accelerator: 'CmdOrCtrl+N',
				click: () => {
					const { createWindow } = require('./main');
					createWindow();
				}
			},
			{/*-------------------------*/  type: 'separator'},
			{role: 'close'},
			{/*-------------------------*/  type: 'separator'},
			{
				label: 'Print...',
				accelerator: 'CmdOrCtrl+P',
				click: (menuItem, browserWindow) => {
					if (browserWindow) {
						browserWindow.webContents.print({}, (success, failureReason) => {
							if (!success) console.log(failureReason);
						});
					}
				}
			},
		]
	},
	{
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{/*-------------------------*/  type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'},
			{role: 'pasteandmatchstyle'},
			//{role: 'delete'},
			{role: 'selectall'},
			{/*-------------------------*/  type: 'separator'},
			{
				label: 'Speech',
				submenu: [
					{role: 'startspeaking'},
					{role: 'stopspeaking' }
				]
			}
		]
	},
	{
		label: 'View',
		submenu: [
			//{role: 'toggledevtools'},
			{/*-------------------------*/  type: 'separator'},
			//{role: 'resetzoom'},
			//{role: 'zoomin', accelerator: ''}, //ideally this should display ⌘+ but also work with ⌘=, but Electron is broken.
			//{role: 'zoomout', accelerator: ''}, //we had to disable zoom in's default keyboard shortcut, so do same for zoom out.
			{/*-------------------------*/  type: 'separator'},
			{role: 'togglefullscreen' }
		]
	},
	{
		label: 'Window',
		submenu: [
			{role: 'minimize'},
			{role: 'zoom'},
			{/*-------------------------*/  type: 'separator'},
			{role: 'front'}
		]
	},
	{
		role: 'help',
		submenu: [
		]
	}
];

function createContextMenuTemplate(params) {
	const {editFlags} = params;
	const hasText = params.selectionText.trim().length > 0
	const can = type => editFlags[`can${type}`] && hasText;
	if (!hasText && !params.isEditable) return [];

	let truncatedSelectedText = params.selectionText.trim()
	if (truncatedSelectedText.length > 20) {
		truncatedSelectedText = truncatedSelectedText.substr(0, 20).trim() + "…"
	}
	contextMenuTemplate = [
		{
			label: 'Look Up “'+ truncatedSelectedText + '”',
			visible: hasText,
			click: (menuItem, browserWindow) => {
				if (browserWindow) {
					browserWindow.webContents.showDefinitionForSelection();
				}
			}
		},
		{/*-------------------------*/  type: 'separator'},
		{
			id: 'cut',
			label: 'Cut',
			role: can('Cut') ? 'cut' : '',
			enabled: can('Cut'),
			visible: params.isEditable
		},
		{
			id: 'copy',
			label: 'Copy',
			role: can('Copy') ? 'copy' : '',
			enabled: can('Copy'),
			visible: params.isEditable || hasText
		},
		{
			id: 'paste',
			label: 'Paste',
			role: editFlags.canPaste ? 'paste' : '',
			enabled: editFlags.canPaste,
			visible: params.isEditable
		},
		{/*-------------------------*/  type: 'separator'},
		{role: 'services', submenu: []},
	];
	
	//delete leading seperators
	let i = 0
	while (contextMenuTemplate[i+1] && contextMenuTemplate[i].visible === false) i++;
	if (contextMenuTemplate[i].type === 'separator') contextMenuTemplate.splice(i, 1);
	
	return contextMenuTemplate;
}


module.exports = {appMenuTemplate, createContextMenuTemplate};
