import app from '@/config/app'

window.io = require('socket.io-client')
console.log('socket.connect', app.socketHost)
window.socket = window.io(app.socketHost)
