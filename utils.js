const { URL } = require('url');
const crypto = require('crypto');

// 验证 URL 是否有效
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

// 验证 URL 是否为图片
function isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.ico', '.tiff', '.svg', '.heic', '.raw', '.psd'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// 生成随机整数（包括 min，不包括 max）
function getRandomInt(min, max) {
    return crypto.randomInt(min, max);
}

// 过滤不合法的字符
function sanitizeInput(input) {
    // 移除可能用于 SQL 注入的字符
    return input.replace(/['";#]/g, '');
}

module.exports = { isValidUrl, isImageUrl, getRandomInt, sanitizeInput };
