export default {
    methods: {
        readAsBinaryString (file) {
            return new Promise(function (resolve, reject) {
                const reader = new FileReader()
                reader.onload = function () {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsBinaryString(file)
            })
        },
        readAsDataURL (file) {
            return new Promise(function (resolve, reject) {
                const reader = new FileReader()
                reader.onload = function () {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        },
    },
}
