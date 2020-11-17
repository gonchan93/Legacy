/*
Legacy
Copyright (c) 2020 gonchan93
Released under the MIT license
https://raw.githubusercontent.com/gonchan93/Legacy/master/LICENSE
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LayerWindow {
    constructor(control) {
        this.control = control;
        const _document = control.ownerDocument;
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
            const innerWindow = this.content.contentWindow;
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
    set outerHeight(height) {
        this.control.style.height = `${height}px`;
    }
    get outerHeight() {
        return this.control.offsetHeight;
    }
    /**
     * ビューポートの高さ
     */
    get innerHeight() {
        return this.content.offsetHeight;
    }
    /**
     * ウインドウの幅
     * @param width 幅(ピクセル単位)
     */
    set outerWidth(width) {
        this.control.style.width = `${width}px`;
    }
    get outerWidth() {
        return this.control.offsetWidth;
    }
    /**
     * ビューポートの幅
     */
    get innerWidth() {
        return this.content.offsetWidth;
    }
    /**
    * 左端からの距離
    * @param x 左端からの距離
    */
    set screenX(x) {
        this.control.style.left = `${x}px`;
    }
    get screenX() {
        return this.control.offsetLeft;
    }
    /**
     * 上端からの距離
     * @param y 上端からのピクセル単位での距離
     */
    set screenY(y) {
        this.control.style.top = `${y}px`;
    }
    get screenY() {
        return this.control.offsetTop;
    }
    /**
     * ユーザーによるサイズ変更を認めるか
     * @param resizable 認める場合はtrue
     */
    set resizable(resizable) {
        if (resizable) {
            this.control.style.resize = "both";
        }
        else {
            this.control.style.resize = "none";
        }
    }
    /**
     * サイズを変更する
     * @param iWidth 幅
     * @param iHeight 高さ
     */
    resizeTo(iWidth, iHeight) {
        this.outerWidth = iWidth;
        this.outerHeight = iHeight;
    }
    /**
     * サイズを変更する
     * @param xDelta 水平方向に拡張するピクセル単位の大きさ
     * @param yDelta 垂直方向に拡張するピクセル単位の大きさ
     */
    resizeBy(xDelta, yDelta) {
        this.resizeTo(this.outerWidth + xDelta, this.outerHeight + yDelta);
    }
    /**
     * 指定された座標に移動する
     * @param x 左端からの距離
     * @param y 上端からの距離
     */
    moveTo(x, y) {
        this.screenX = x;
        this.screenY = y;
    }
    /**
     * 指定された量だけ移動する
     * @param deltaX 水平方向に移動させるピクセル単位の大きさ
     * @param deltaY 垂直方向に移動させるピクセル単位の大きさ
     */
    moveBy(deltaX, deltaY) {
        this.moveTo(this.screenX + deltaX, this.screenY + deltaY);
    }
    close() {
        this.control.close();
    }
    /**
     * モーダルダイアログを表示する
     * @param url 表示するサイトのURL。
     */
    showModal(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.content.src = url;
            this.control.showModal();
            const barHeight = this.titleBar.getBoundingClientRect().height;
            this.content.style.height = `calc(100% - ${barHeight}px)`;
            return new Promise((resolve, reject) => {
                this.control.onclose = () => {
                    var _a;
                    resolve((_a = this.content.contentWindow) === null || _a === void 0 ? void 0 : _a.returnValue);
                };
            });
        });
    }
}
/**
 * 疑似的なウインドウを表示
 * @param url 表示するページのURL
 * @param dialogArguments ウインドウに渡すパラメータ
 * @param options 装飾を指定するオプション
 */
export function showModalDialog(url, dialogArguments, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const dialog = document.body.appendChild(document.createElement("dialog"));
        try {
            const lw = new LayerWindow(dialog);
            if (dialogArguments !== undefined) {
                lw.dialogArguments = dialogArguments;
            }
            if (typeof options !== 'undefined') {
                if (typeof options.width === 'number') {
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
            if (options === null || options === void 0 ? void 0 : options.center) {
                const x = (window.innerWidth - lw.outerWidth) / 2;
                const y = (window.innerHeight - lw.outerHeight) / 2;
                lw.moveTo(x, y);
            }
            return yield result;
        }
        finally {
            document.body.removeChild(dialog);
        }
    });
}
