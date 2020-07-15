/**
 * 加密字符串的key
 */
export const CryptoKey: string = "t@qPbyX6mS@V!sr@C9^TPg8*m2BgjP*SRAXF&gNOSv12h*&BPI6b*0MU#pIYQXl5";

/**
 * 数据库列表key
 */
export const DBListKey: string = "DBListKey";

/**
 * Store数据持久化存储
 */
export const Store = window.require('electron-store');

/**
 * mysql数据库
 */
export const MySql = window.require('mysql');

/**
 * Loadsh库
 */
export const Loadsh = require('lodash');

/**
 * 加密字符串
 * @param text 字符串
 */
export function Encrypt(text: string) {
    var CryptoJS = require("crypto-js");
    return CryptoJS.AES.encrypt(text, CryptoKey).toString();
}

/**
 * 解密字符串
 * @param text 字符串
 */
export function Decrypt(text: string) {
    var CryptoJS = require("crypto-js");
    var bytes = CryptoJS.AES.decrypt(text, CryptoKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}