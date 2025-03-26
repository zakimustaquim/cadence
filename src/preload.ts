// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Add error logging
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

console.log('Preload script starting...');

// Expose IPC handler in main process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => {
      console.log(`IPC sending on channel "${channel}"`, args);
      try {
        ipcRenderer.send(channel, ...args);
        console.log('IPC message sent successfully');
      } catch (error) {
        console.error('Error sending IPC message:', error);
      }
    },
  },
});

console.log('Preload script loaded successfully');
