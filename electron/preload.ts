import { ipcRenderer, contextBridge } from "electron";

/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
    electronAPI: {
      setMouseIgnore: (ignore: boolean) => void;
    };
  }
}
contextBridge.exposeInMainWorld("electronAPI", {
  setMouseIgnore: (ignore: boolean) =>
    ipcRenderer.send("set-ignore-mouse-events", ignore),
});
const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sayHello`
   */
  sendMessage: (message: string) => {
    ipcRenderer.send("message", message);
  },
  /**
    Here function for AppBar
   */
  Minimize: () => {
    ipcRenderer.send("minimize");
  },
  Maximize: () => {
    ipcRenderer.send("maximize");
  },
  Close: () => {
    ipcRenderer.send("close");
  },
  // removeLoading: () => {
  //   removeLoading();
  // },
  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
};

contextBridge.exposeInMainWorld("Main", api);
