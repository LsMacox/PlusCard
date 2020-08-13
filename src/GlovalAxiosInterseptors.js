import axios from 'axios'
import store from '@/store'

window.axios = axios

const TokenKey = process.env.TOKEN_KEY || 'Authorization'

// request interceptor
axios.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store._vm.$session.exists()) {
      config.headers[TokenKey] = 'Bearer ' + store._vm.$session.get('access_token')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  },
)
