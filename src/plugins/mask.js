export default {
    bind(v) {
    },
    inserted(el, binding) {
        
    },
    update(el, binding) {
        const pattern = binding.value

        if (el.tagName != 'INPUT') {
            var input = el.querySelector('input')
        } else {
            var input = el
        }
        
        input.selectionStart = 0
        input.onkeydown = function (e) {
            e.target.value = insertInputValue(e.target.value, pattern, e.key)
        }
    },
    componentUpdated(e) {
    },
}

const patterns = {
    '#': {pattern: /\d/},
    'X': {pattern: /[0-9a-zA-Z]/},
    'S': {pattern: /[a-zA-Z]/},
    'A': {pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase()},
    'a': {pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase()},
    '!': {escape: true}
}


function insertInputValue(val, pattern, word) {
    if (val.length <= pattern.length) {
        if (checkMatchPattern(word)) {
            val += word
        }
    }
    return val
}

function checkMatchPattern(word) {
    console.log(word, patterns['#'], String(word).match(patterns['#']) )
    for (var key in patterns) {
        if (word.match(patterns[key]) && word.match(patterns[key]).length > 0) {
            return true
        }
        return false
    }
}


function getPatternSymbolsLength(pattern) {
    let patternSymbols = 0
    for (var i = 0; i < pattern.length; i++) {
        for (var key in patterns) {
            if (pattern.charAt(i) == key) {
                patternSymbols++
            }
        }
    }
    return patternSymbols
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}