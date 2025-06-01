import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL} from 'url';
export function isDev(): boolean{
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EvenPayloadMapping>(
    key: Key, 
    handler: () => EvenPayloadMapping[Key]
) {
    ipcMain.handle(key, (event) =>{
        validateEventFrame(event.senderFrame);
        return handler();
    });
}
export function ipcMainOn<Key extends keyof EvenPayloadMapping>(
    key: Key, 
    handler: (payload: EvenPayloadMapping[Key]) => void
) {
    ipcMain.on(key, (event,payload) =>{
        validateEventFrame(event.senderFrame);
        return handler(payload);
    });
}
export function ipcWebContentsSend<Key extends keyof EvenPayloadMapping>(
    key: Key, 
    WebContents: WebContents,
    payload: EvenPayloadMapping[Key]
) {
    WebContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain | null){
    if (!frame) {
        throw new Error('Frame is null');
    }
    if (isDev() && new URL(frame.url).host === 'localhost:5123') {
        return;
    }
    if (frame.url !== pathToFileURL(getUIPath()).toString()) {
        throw new Error('Malicious event');
    }
}
