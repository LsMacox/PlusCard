module.exports = Object.freeze({
    title: 'Plus Cabinet',
    version: '2.10.9',
    build: 301, // Server-API
    apiHost: process.env.VUE_APP_BASE_API || 'https://test-backend.pluscards.ru',
    socketHost: process.env.VUE_APP_SOCKET_HOST || 'https://test-backend.pluscards.ru:6001',
    fileStorage: process.env.VUE_APP_FILE_HOST || 'https://storage.yandexcloud.net/plusstorage/',
    RECAPTCHA_SITE_KEY: process.env.VUE_APP_RECAPTCHA_SITE_KEY || '',
    cacheTTL: 5 * 60, // second
})
