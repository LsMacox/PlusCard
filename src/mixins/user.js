export default {
    methods: {
        getFIO (user) {
            let fio = 'Клиент'
            if (user) {
                fio = 'Клиент ' + user.id
                if (user.name) {
                    fio = user.name
                }
                if (user.name && user.lastname) {
                    fio = user.name + ' ' + user.lastname
                }
            }
            return fio
        },
    },
}
