// import VueSession from '@/utils/session'
import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'

export default {
    namespaced: true,
    state: {

    },
    mutations: {

    },
    actions: {
        async confirm ({ commit, rootState }, confirm) {
           // console.log('redis confirm request')
           // console.log(confirm)
           await ApiService.post('/api/message/send/confirm', confirm)
           // console.log('redis confirm response')
           // console.log(success)
        },
        async connect ({ rootState }) {
            // console.log('redis.connect')
            // const session = JSON.parse(localStorage.getItem('session'))

            if (VueSession.exists()) {
                const device = rootState['auth/auth'].device

               const event = {
                command: '/connect/redis',
                access_token: VueSession.get('access_token'),
                device_id: device.id,
                device_type: device.type,

                }
                // console.log('socket.emit.system', event)
                window.socket.emit('system', event)
            }
        },
    },
    getters: {

    },
}
