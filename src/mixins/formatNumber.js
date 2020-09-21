export default {
    methods: {
        formatNumberString (num) {
            const int = String(Math.trunc(num))
            if (int.length <= 3) return int
            let space = 0
            let number = ''

            for (let i = int.length - 1; i >= 0; i--) {
                if (space === 3 && int.charAt(i) !== '-') {
                    number = ' ' + number
                    space = 0
                }
                number = int.charAt(i) + number
                space++
            }

            return number
        },
    },
}
