const { ipcRenderer, contextBridge } = require('electron')


const close = () => {
    ipcRenderer.send('close', true);
}

const onError = (callBack) => {
    ipcRenderer.on('error', (e, a) => {
        callBack(a)
    });
}


const api = {
    close,
    onError,
}

contextBridge.exposeInMainWorld('api', api);

