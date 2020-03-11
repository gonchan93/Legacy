declare global {
    interface Window {
        dialogArguments: any;
        returnValue: any;
    }
}
export interface DialogOption {
    /**
     * 疑似ウインドウを中央に表示するか
     */
    center?: boolean;
    /**
     * 幅
     */
    width?: number;
    /**
     * 高さ
     */
    height?: number;
    /**
     * 上端からの距離
     */
    top?: number;
    /**
     * 左端からの距離
     */
    left?: number;
    /**
     * ユーザーによるサイズ変更を認めるか
     */
    resizable?: boolean;
}
/**
 * 疑似的なウインドウを表示
 * @param url 表示するページのURL
 * @param dialogArguments ウインドウに渡すパラメータ
 * @param options 装飾を指定するオプション
 */
export declare function showModalDialog(url: string, dialogArguments?: any, options?: DialogOption): Promise<any>;
