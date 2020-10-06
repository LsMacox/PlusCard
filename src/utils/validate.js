function asMixin (fun) {
    const methods = {}
    methods[fun.name] = fun

    return { methods }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
function isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
function validUsername (str) {
    const validMap = ['admin', 'editor']
    return validMap.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
function validURL (url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
function validLowerCase (str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
function validUpperCase (str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
function validAlphabets (str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
function validEmail (email) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
function isString (str) {
    if (typeof str === 'string' || str instanceof String) {
        return true
    }
    return false
}

/**
 * @param {any} val
 * @returns {Boolean}
 */
function isNumber (val) {
    return typeof val === 'number' || val instanceof Number
}

/**
 * @param {any} val
 * @returns {Boolean}
 */
function isInteger (val) {
  return /^-?[0-9]+$/.test(String(val))
}

/**
 * @param {any} val
 * @returns {Boolean}
 */
function isPosNumber (val) {
    return isNumber(val) && val > 0
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
function isArray (arg) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}

/**
 * @returns {Boolean}
 */
function isFilled (value) {
    return !!value
}

/**
 * @returns {Boolean}
 */
function isEmpty (value) {
    return !!value
}

/**
 * @param {string} str
 * @param {number} max
 * @returns {Boolean}
 */
function maxLen (str, max) {
    return str.length <= max
}

export {
    asMixin,
    isExternal,
    validUsername,
    validURL,
    validLowerCase,
    validAlphabets,
    validEmail,
    isString,
    isNumber,
    isInteger,
    isPosNumber,
    isArray,
    isFilled,
    isEmpty,
    maxLen,
}
