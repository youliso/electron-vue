import {resolve} from "path";
import {ipcRenderer, remote} from "electron";

/**
 * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
 * @param path lib/inside为起点的相对路径
 * */
export function getInsidePath(path: string): string {
    if (global.sharedObject) return global.sharedObject["isPackaged"] ? resolve(__dirname, '../inside/' + path) : resolve('./src/lib/inside/' + path);
    else return remote.getGlobal("sharedObject")["isPackaged"] ? resolve(__dirname, '../inside/' + path) : resolve('./src/lib/inside/' + path);
}

/**
 * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
 * @param path lib/extern为起点的相对路径
 * */
export function getExternPath(path: string): string {
    if (global.sharedObject) return global.sharedObject["isPackaged"] ? resolve(__dirname, '../../extern/' + path) : resolve('./src/lib/extern/' + path);
    else return remote.getGlobal("sharedObject")["isPackaged"] ? resolve(__dirname, '../../extern/' + path) : resolve('./src/lib/extern/' + path);
}

/**
 * 设置全局参数
 * @param key 键
 * @param value 值
 */
export function sendGlobal(key: string, value: unknown) {
    !isNull(global.sharedObject) ? global.sharedObject[key] = value : ipcRenderer.sendSync("global-sharedObject", {
        key,
        value
    });
}

/**
 * 获取全局参数
 * @param key 键
 */
export function getGlobal(key: string) {
    return !isNull(global.sharedObject) ? global.sharedObject[key] : remote.getGlobal("sharedObject")[key];
}

/**
 * 判空
 * */
export function isNull(o: unknown): boolean {
    return o === "" || o === undefined || o === null || o === "undefined" || o === "null";
}

/**
 * 随机整数
 * 例如 6-10 （m-n）
 * */
export function ranDom(m: number, n: number): number {
    return Math.floor(Math.random() * (n - m)) + m;
}

/**
 * 数组元素互换
 * */
export function swapArr<T>(arr: T[], index1: number, index2: number): void {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

/**
 * 日期转换
 * @param fmt yy-MM-dd hh:mm:ss
 * */
export function dateFormat(fmt: string = 'yyyy-MM-dd'): string {
    let date = new Date();
    let o: { [key: string]: unknown } = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) as string : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 深拷贝
 * @param sourceObj
 * @param targetObj
 */
export function deepClone(sourceObj: any, targetObj: any) {
    let cloneObj: any = {};
    if (!sourceObj || typeof sourceObj !== "object" || sourceObj.length === undefined) {
        return sourceObj;
    }
    if (sourceObj instanceof Array) {
        cloneObj = sourceObj.concat();
    } else {
        for (let i in sourceObj) {
            if (typeof sourceObj[i] === 'object') {
                cloneObj[i] = deepClone(sourceObj[i], {});
            } else {
                cloneObj[i] = sourceObj[i];
            }
        }
    }
    return cloneObj;
}