module.exports = Object.freeze({
    title: 'Plus Cabinet',
    version: '2.1.6',
    build: 301, // Server-API
    socketHost: process.env.VUE_APP_SOCKET_HOST || 'https://test-backend.pluscards.ru:6001',
    RECAPTCHA_SITE_KEY: process.env.VUE_APP_RECAPTCHA_SITE_KEY || '',
})
