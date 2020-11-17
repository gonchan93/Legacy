/*
Legacy
Copyright (c) 2020 gonchan93
Released under the MIT license
https://raw.githubusercontent.com/gonchan93/Legacy/master/LICENSE
*/

declare global {
    interface Window {
        dialogArguments: any;
        returnValue: any;
    }
}

class LayerWindow {
    /**
     * 表示先に渡す値
     */
    dialogArguments: any;

    /**
     * タイトルバー
     */
    private readonly titleBar: HTMLDivElement;
    /**
     * 表示領域
     */
    private readonly content: HTMLIFrameElement;
    private x!: number;
    private y!: number;

    constructor(private control: HTMLDialogElement) {
        const _document = control.ownerDocument!;
        this.titleBar = control.appendChild(_document.createElement("div"));
        this.resizable = true;
        control.style.overflow = "hidden";
        control.style.boxSizing = "border-box";
        control.style.margin = "0px";
        control.style.padding = "1px";
        control.draggable = true;
        control.addEventListener("dragstart", (e) => {
            this.titleBar.style.cursor = "grabbing";
            this.x = e.screenX;
            this.y = e.screenY;
        });
        control.addEventListener("dragover", (e) => { e.preventDefault(); });
        control.addEventListener("dragend", (e) => {
            this.titleBar.style.cursor = "grab";
            this.moveBy(e.screenX - this.x, e.screenY - this.y);
        });
        this.titleBar.style.display = "flex";
        this.titleBar.style.cursor = "grab";
        const titleArea = this.titleBar.appendChild(_document.createElement("div"));
        const buttonArea = this.titleBar.appendChild(_document.createElement("div"));
        buttonArea.style.marginLeft = "auto";
        const closeButton = buttonArea.appendChild(_document.createElement("input"));
        closeButton.type = "button";
        closeButton.value = "×";
        closeButton.onclick = () => { this.close(); };
        this.content = control.appendChild(_document.createElement("iframe"));
        this.content.style.boxSizing = "border-box";
        this.content.style.width = "100%";
        this.content.onload = () => {
            const innerWindow = this.content.contentWindow!;
            titleArea.innerText = innerWindow.document.title;
            innerWindow.dialogArguments = this.dialogArguments;
            //iframeで開いているページのcloseメソッドを書き換える
            innerWindow.close = this.close.bind(this);
            innerWindow.resizeTo = this.resizeTo;
            innerWindow.resizeBy = this.resizeBy;
            innerWindow.moveTo = this.moveTo;
            innerWindow.moveBy = this.moveBy;
        };

    }
    /**
     * ウィンドウの高さ
     * @param height 高さ(ピクセル単位)
     */
    set outerHeight(height: number) {
        this.control.style.height = `${height}px`;
    }
    get outerHeight(): number {
        return this.control.offsetHeight;
    }
    /**
     * ビューポートの高さ
     */
    get innerHeight(): number {
        return this.content.offsetHeight;
    }

    /**
     * ウインドウの幅
     * @param width 幅(ピクセル単位)
     */
    set outerWidth(width: number) {
        this.control.style.width = `${width}px`;
    }
    get outerWidth(): number {
        return this.control.offsetWidth;
    }
    /**
     * ビューポートの幅
     */
    get innerWidth(): number {
        return this.content.offsetWidth;
    }

    /**
    * 左端からの距離
    * @param x 左端からの距離
    */
    set screenX(x: number) {
        this.control.style.left = `${x}px`;
    }
    get screenX(): number {
        return this.control.offsetLeft;
    }

    /**
     * 上端からの距離
     * @param y 上端からのピクセル単位での距離
     */
    set screenY(y: number) {
        this.control.style.top = `${y}px`;
    }
    get screenY(): number {
        return this.control.offsetTop;
    }

    /**
     * ユーザーによるサイズ変更を認めるか
     * @param resizable 認める場合はtrue
     */
    set resizable(resizable: boolean) {
        if (resizable) {
            this.control.style.resize = "both";
        } else {
            this.control.style.resize = "none";
        }
    }

    /**
     * サイズを変更する
     * @param iWidth 幅
     * @param iHeight 高さ
     */
    resizeTo(iWidth: number, iHeight: number) {
        this.outerWidth = iWidth;
        this.outerHeight = iHeight;
    }
    /**
     * サイズを変更する
     * @param xDelta 水平方向に拡張するピクセル単位の大きさ
     * @param yDelta 垂直方向に拡張するピクセル単位の大きさ
     */
    resizeBy(xDelta: number, yDelta: number): void {
        this.resizeTo(this.outerWidth + xDelta, this.outerHeight + yDelta);
    }

    /**
     * 指定された座標に移動する
     * @param x 左端からの距離
     * @param y 上端からの距離
     */
    moveTo(x: number, y: number) {
        this.screenX = x;
        this.screenY = y;
    }
    /**
     * 指定された量だけ移動する
     * @param deltaX 水平方向に移動させるピクセル単位の大きさ
     * @param deltaY 垂直方向に移動させるピクセル単位の大きさ
     */
    moveBy(deltaX: number, deltaY: number) {
        this.moveTo(this.screenX + deltaX, this.screenY + deltaY);
    }

    close() {
        this.control.close();
    }

    /**
     * モーダルダイアログを表示する
     * @param url 表示するサイトのURL。
     */
    public async showModal(url: string): Promise<any> {
        this.content.src = url;
        this.control.showModal();
        const barHeight = this.titleBar.getBoundingClientRect().height;
        this.content.style.height = `calc(100% - ${barHeight}px)`;
        return new Promise<any>((resolve, reject) => {
            this.control.onclose = () => {
                resolve(this.content.contentWindow?.returnValue);
            };
        });
    }
}

export interface DialogOption{
    /**
     * 疑似ウインドウを中央に表示するか
     */
    center:boolean;
    /**
     * 幅
     */
    width: number;
    /**
     * 高さ
     */
    height: number;
    /**
     * 上端からの距離
     */
    top: number;
    /**
     * 左端からの距離
     */
    left: number;
    /**
     * ユーザーによるサイズ変更を認めるか
     */
    resizable: boolean;
}

/**
 * 疑似的なウインドウを表示
 * @param url 表示するページのURL
 * @param dialogArguments ウインドウに渡すパラメータ
 * @param options 装飾を指定するオプション
 */
export async function showModalDialog(url: string, dialogArguments?: any, options?: Partial<DialogOption>): Promise<any> {
    const dialog = document.body.appendChild(document.createElement("dialog"));
    try {
        const lw = new LayerWindow(dialog);
        if (dialogArguments !== undefined) {
            lw.dialogArguments = dialogArguments;
        }
        if(typeof options !== 'undefined'){
            if(typeof options.width === 'number'){
                lw.outerWidth = options.width;
            }
            if (options.height !== undefined) {
                lw.outerHeight = options.height;
            }
            if (options.resizable !== undefined) {
                lw.resizable = options.resizable;
            }
            if (options.top !== undefined) {
                lw.screenY = options.top;
            }
            if (options.left !== undefined) {
                lw.screenX = options.left;
            }
        }
        const result = lw.showModal(url);
        if (options?.center) {
            const x = (window.innerWidth - lw.outerWidth) / 2;
            const y = (window.innerHeight - lw.outerHeight) / 2;
            lw.moveTo(x, y);
        }
        return await result;
    } finally {
        document.body.removeChild(dialog);
    }
}

