const electron = require('electron') as typeof import('electron');;

electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => 
        ipcOn("statistics", (stats) => {
            callback(stats);
        }),
    subscribeChangeView: (callback) => 
        ipcOn("changeView", (view) => {
            callback(view);
        }),
    getStaticData: () => ipcInvoke('getStaticData'),
    sendFrameAction: (payload)=>ipcSend("sendFrameAction",payload),
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EvenPayloadMapping>(
    key:Key,
): Promise<EvenPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
    
}

function ipcOn<Key extends keyof EvenPayloadMapping>(
    key:Key,
    callback: (payload: EvenPayloadMapping[Key]) => void
) {
    const cb = (_:Electron.IpcRendererEvent , payload:any) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EvenPayloadMapping>(
    key:Key,
    payload: EvenPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload);
}