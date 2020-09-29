/// <reference path="../electron.d.ts" />

 /**
 * This file augments the Electron TS namespace with the internal APIs
 * that are not documented but are used by Electron internally
 */

declare namespace Electron {
  enum ProcessType {
    browser = 'browser',
    renderer = 'renderer',
    worker = 'worker'
  }

  interface App {
    _setDefaultAppPaths(packagePath: string | null): void;
    setVersion(version: string): void;
    setDesktopName(name: string): void;
    setAppPath(path: string | null): void;
  }

  type TouchBarItemType = NonNullable<Electron.TouchBarConstructorOptions['items']>[0];

  interface BaseWindow {
    _init(): void;
  }

  interface BrowserWindow {
    _init(): void;
    _touchBar: Electron.TouchBar | null;
    _setTouchBarItems: (items: TouchBarItemType[]) => void;
    _setEscapeTouchBarItem: (item: TouchBarItemType | {}) => void;
    _refreshTouchBarItem: (itemID: string) => void;
    on(event: '-touch-bar-interaction', listener: (event: Event, itemID: string, details: any) => void): this;
    removeListener(event: '-touch-bar-interaction', listener: (event: Event, itemID: string, details: any) => void): this;
  }

  interface ContextBridge {
    internalContextBridge: {
      contextIsolationEnabled: boolean;
      overrideGlobalValueFromIsolatedWorld(keys: string[], value: any): void;
      overrideGlobalValueWithDynamicPropsFromIsolatedWorld(keys: string[], value: any): void;
      overrideGlobalPropertyFromIsolatedWorld(keys: string[], getter: Function, setter?: Function): void;
      isInMainWorld(): boolean;
    }
  }

  interface TouchBar {
    _removeFromWindow: (win: BrowserWindow) => void;
  }

  interface WebContents {
    _getURL(): string;
    _loadURL(url: string, options: ElectronInternal.LoadURLOptions): void;
    _stop(): void;
    _goBack(): void;
    _goForward(): void;
    _goToOffset(offset: number): void;
    getOwnerBrowserWindow(): Electron.BrowserWindow;
    getWebPreferences(): Electron.WebPreferences;
    getLastWebPreferences(): Electron.WebPreferences;
    _getPreloadPaths(): string[];
    _sendToFrameInternal(frameId: number, channel: string, ...args: any[]): boolean;
    equal(other: WebContents): boolean;
    _initiallyShown: boolean;
  }

  interface WebPreferences {
    guestInstanceId?: number;
    openerId?: number;
  }

  interface SerializedError {
    message: string;
    stack?: string,
    name: string,
    from: Electron.ProcessType,
    cause: SerializedError,
    __ELECTRON_SERIALIZED_ERROR__: true
  }

  interface ErrorWithCause extends Error {
    from?: string;
    cause?: ErrorWithCause;
  }

  interface InjectionBase {
    url: string;
    code: string
  }

  interface ContentScript {
    js: Array<InjectionBase>;
    css: Array<InjectionBase>;
    runAt: string;
    matches: {
      some: (input: (pattern: string) => boolean | RegExpMatchArray | null) => boolean;
    }
    /**
     * Whether to match all frames, or only the top one.
     * https://developer.chrome.com/extensions/content_scripts#frames
     */
    allFrames: boolean
  }

  type ContentScriptEntry = {
    extensionId: string;
    contentScripts: ContentScript[];
  }

  interface IpcRendererInternal extends Electron.IpcRenderer {
    invoke<T>(channel: string, ...args: any[]): Promise<T>;
    sendToAll(webContentsId: number, channel: string, ...args: any[]): void
  }

  interface WebContentsInternal extends Electron.WebContents {
    _send(internal: boolean, sendToAll: boolean, channel: string, args: any): boolean;
    _sendToFrame(internal: boolean, sendToAll: boolean, frameId: number, channel: string, args: any): boolean;
    _sendToFrameInternal(frameId: number, channel: string, args: any): boolean;
    _postMessage(channel: string, message: any, transfer?: any[]): void;
    _sendInternal(channel: string, ...args: any[]): void;
    _sendInternalToAll(channel: string, ...args: any[]): void;
    _printToPDF(options: any): Promise<Buffer>;
    _print(options: any, callback?: (success: boolean, failureReason: string) => void): void;
    _getPrinters(): Electron.PrinterInfo[];
    _init(): void;
    canGoToIndex(index: number): boolean;
    getActiveIndex(): number;
    length(): number;
  }

  interface Menu {
    _init(): void;
    _isCommandIdChecked(id: string): boolean;
    _isCommandIdEnabled(id: string): boolean;
    _shouldCommandIdWorkWhenHidden(id: string): boolean;
    _isCommandIdVisible(id: string): boolean;
    _getAcceleratorForCommandId(id: string, useDefaultAccelerator: boolean): Accelerator | undefined;
    _shouldRegisterAcceleratorForCommandId(id: string): boolean;
    _callMenuWillShow(): void;
    _executeCommand(event: any, id: number): void;
    _menuWillShow(): void;
    commandsMap: Record<string, MenuItem>;
    groupsMap: Record<string, {
      checked: boolean;
    }[]>;
    getItemCount(): number;
    popupAt(window: BaseWindow, x: number, y: number, positioning: number, callback: () => void): void;
    closePopupAt(id: number): void;
    setSublabel(index: number, label: string): void;
    setToolTip(index: number, tooltip: string): void;
    setIcon(index: number, image: string | NativeImage): void;
    setRole(index: number, role: string): void;
    insertItem(index: number, commandId: number, label: string): void;
    insertCheckItem(index: number, commandId: number, label: string): void;
    insertRadioItem(index: number, commandId: number, label: string, groupId: number): void;
    insertSeparator(index: number): void;
    insertSubMenu(index: number, commandId: number, label: string, submenu?: Menu): void;
    delegate?: any;
    getAcceleratorTextAt(index: number): string;
  }

  interface MenuItem {
    overrideReadOnlyProperty(property: string, value: any): void;
    groupId: number;
    getDefaultRoleAccelerator(): Accelerator | undefined;
    acceleratorWorksWhenHidden?: boolean;
  }


  const deprecate: ElectronInternal.DeprecationUtil;

  namespace Main {
    const deprecate: ElectronInternal.DeprecationUtil;
  }

  class View {}

  // Experimental views API
  class BaseWindow {
    constructor(args: {show: boolean})
    setContentView(view: View): void
    static fromId(id: number): BaseWindow;
    static getAllWindows(): BaseWindow[];
    isFocused(): boolean;
    static getFocusedWindow(): BaseWindow | undefined;
    setMenu(menu: Menu): void;
  }
  class WebContentsView {
    constructor(options: BrowserWindowConstructorOptions)
  }

  // Deprecated / undocumented BrowserWindow methods
  interface BrowserWindow {
    getURL(): string;
    send(channel: string, ...args: any[]): void;
    openDevTools(options?: Electron.OpenDevToolsOptions): void;
    closeDevTools(): void;
    isDevToolsOpened(): void;
    isDevToolsFocused(): void;
    toggleDevTools(): void;
    inspectElement(x: number, y: number): void;
    inspectSharedWorker(): void;
    inspectServiceWorker(): void;
    getBackgroundThrottling(): void;
    setBackgroundThrottling(allowed: boolean): void;
  }

  namespace Main {
    class BaseWindow extends Electron.BaseWindow {}
    class View extends Electron.View {}
    class WebContentsView extends Electron.WebContentsView {}
  }
}

declare namespace ElectronInternal {
  type DeprecationHandler = (message: string) => void;
  interface DeprecationUtil {
    warnOnce(oldName: string, newName?: string): () => void;
    setHandler(handler: DeprecationHandler | null): void;
    getHandler(): DeprecationHandler | null;
    warn(oldName: string, newName: string): void;
    log(message: string): void;
    removeFunction(fn: Function, removedName: string): Function;
    renameFunction(fn: Function, newName: string | Function): Function;
    event(emitter: NodeJS.EventEmitter, oldName: string, newName: string): void;
    removeProperty<T, K extends (keyof T & string)>(object: T, propertyName: K, onlyForValues?: any[]): T;
    renameProperty<T, K extends (keyof T & string)>(object: T, oldName: string, newName: K): T;
    moveAPI<T extends Function>(fn: T, oldUsage: string, newUsage: string): T;
  }

  interface DesktopCapturer {
    startHandling(captureWindow: boolean, captureScreen: boolean, thumbnailSize: Electron.Size, fetchWindowIcons: boolean): void;
    _onerror?: (error: string) => void;
    _onfinished?: (sources: Electron.DesktopCapturerSource[], fetchWindowIcons: boolean) => void;
  }

  interface GetSourcesOptions {
    captureWindow: boolean;
    captureScreen: boolean;
    thumbnailSize: Electron.Size;
    fetchWindowIcons: boolean;
  }

  interface GetSourcesResult {
    id: string;
    name: string;
    thumbnail: Electron.NativeImage;
    display_id: string;
    appIcon: Electron.NativeImage | null;
  }

  interface KeyWeakMap<K, V> {
    set(key: K, value: V): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    remove(key: K): void;
  }

  // Internal IPC has _replyInternal and NO reply method
  interface IpcMainInternalEvent extends Omit<Electron.IpcMainEvent, 'reply'> {
    _replyInternal(...args: any[]): void;
  }

  interface IpcMainInvokeEvent extends Electron.IpcMainInvokeEvent {
    _reply(value: any): void;
    _throw(error: Error): void;
  }

  interface IpcMainInternal extends NodeJS.EventEmitter {
    handle(channel: string, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any): void;
    on(channel: string, listener: (event: IpcMainInternalEvent, ...args: any[]) => void): this;
    once(channel: string, listener: (event: IpcMainInternalEvent, ...args: any[]) => void): this;
  }

  interface LoadURLOptions extends Electron.LoadURLOptions {
    reloadIgnoringCache?: boolean;
  }

  type ModuleLoader = () => any;

  interface ModuleEntry {
    name: string;
    private?: boolean;
    loader: ModuleLoader;
  }

  interface WebFrameInternal extends Electron.WebFrame {
    getWebFrameId(window: Window): number;
    allowGuestViewElementDefinition(window: Window, context: any): void;
  }

  interface WebFrameResizeEvent extends Electron.Event {
    newWidth: number;
    newHeight: number;
  }

  interface WebViewEvent extends Event {
    url: string;
    isMainFrame: boolean;
  }

  class WebViewElement extends HTMLElement {
    static observedAttributes: Array<string>;

    public contentWindow: Window;

    public connectedCallback?(): void;
    public attributeChangedCallback?(): void;
    public disconnectedCallback?(): void;

    // Created in web-view-impl
    public getWebContentsId(): number;
    public capturePage(rect?: Electron.Rectangle): Promise<Electron.NativeImage>;
  }
}

declare namespace Chrome {
  namespace Tabs {
    // https://developer.chrome.com/extensions/tabs#method-executeScript
    interface ExecuteScriptDetails {
      code?: string;
      file?: string;
      allFrames?: boolean;
      frameId?: number;
      matchAboutBlank?: boolean;
      runAt?: 'document-start' | 'document-end' | 'document_idle';
      cssOrigin: 'author' | 'user';
    }

    type ExecuteScriptCallback = (result: Array<any>) => void;

    // https://developer.chrome.com/extensions/tabs#method-sendMessage
    interface SendMessageDetails {
      frameId?: number;
    }

    type SendMessageCallback = (result: any) => void;
  }
}

interface Global extends NodeJS.Global {
  require: NodeRequire;
  module: NodeModule;
  __filename: string;
  __dirname: string;
}
