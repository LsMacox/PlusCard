export default {
    methods: {
        getFIO (user) {
            let fio = null
            if (user) {
                if (user.name) {
                    fio = user.name
                }
                if (user.name && user.lastname) {
                    fio = user.name + ' ' + user.lastname
                }
                if (!fio) {
                    fio = user.phone
                }
                if (!fio) {
                    fio = user.email
                }
            }
            if (user && !fio) {
                fio = 'Пользователь ' + user.id
            }
            if (!fio) {
                fio = 'Пользователь'
            }
            return fio
        },
    },
}
