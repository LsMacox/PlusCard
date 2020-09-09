// import VueSession from '@/utils/session'
import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {

    },
    mutations: {
        connect () {
            let session = JSON.parse(localStorage.getItem('session'))

            let accessToken = null
            let deviceId = null
            let deviceType = null
            if (!session) session = {}
            if (session.tokens && session.device) {
                accessToken = session.tokens.access
                deviceId = session.device.id
                deviceType = session.device.type
            }
            window.socket.emit('system', {
                command: '/connect/redis',
                access_token: accessToken,
                device_id: deviceId,
                device_type: deviceType,
            })
        },
    },
    actions: {
        async confirm ({ commit, rootState }, confirm) {
           // console.log('redis confirm request')
           // console.log(confirm)
           await ApiService.post('/api/message/send/confirm', confirm)
           // console.log('redis confirm response')
           // console.log(success)
        },
    },
    getters: {

    },
}
