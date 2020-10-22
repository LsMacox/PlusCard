import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {app} from '@/config'

// const NEW_LINE = '&#13'
const NEW_LINE = '<br/>'

function ParseValidationError (validation) {
  let resStr = '<ul style="margin-left: 2em;">'
  for (const fieldName in validation) {
    if (Object.prototype.hasOwnProperty.call(validation, fieldName)) {
      const fieldErrors = validation[fieldName]
      fieldErrors.forEach(element => {
        resStr += `<li>${element}</li>`
      })
    }
  }
  resStr += '</ul>'
  return resStr
}

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || 'Authorization'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000, // request timeout
  headers: {
    Build: app.build,
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    const accessToken = store._vm.$session.get('access_token')
    if (accessToken) {
      config.headers[ACCESS_TOKEN_KEY] = 'Bearer ' + accessToken
    }

    store.commit('app/LOADING_REQUEST', true)
    store._vm.$Progress.start()
    return config
  },
  error => {
    // do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  response => {
    store.commit('app/LOADING_REQUEST', false)
    store._vm.$Progress.finish()
    const resData = response.data
    return resData.data ? resData.data : resData
  },
  error => {
    console.error('err', error) // for debug
    store._vm.$Progress.fail()
    store.commit('app/LOADING_REQUEST', false)

    if (error.response) {
      console.error(' error.response.status ', error.response.status)
      if (
        error.config &&
        (!Object.prototype.hasOwnProperty.call(error.config, 'errorHandle') ||
          error.config.errorHandle === true)
      ) {
        let errorMessage = 'Не известная серверная ошибка'
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message
          if (error.response.data.error === 'Illuminate\\Validation\\ValidationException' && error.response.data.validation) {
            errorMessage += ':' + NEW_LINE + ParseValidationError(error.response.data.validation)
          }
        }

        store._vm.$notify({
          type: 'error',
          group: 'api',
          title: 'Серверная ошибка',
          text: errorMessage,
        })
      }

      if (error.response.status === 401) {
        // HTTP_UNAUTHORIZED, AuthenticationException
        // console.log('HTTP_UNAUTHORIZED')
        // axios.interceptors.response.eject(interceptor)
        return store
          .dispatch('auth/auth/RefreshToken')
          .then(result => {
            return axios(error.response.config)
          })
          .catch(error => {
            return Promise.reject(error)
          })
      }
    } else {
      store._vm.$notify({
        type: 'error',
        group: 'api',
        title: 'Ошибка',
        text: 'Сервер недоступен',
      })
    }

    return Promise.reject(error)
  },
)

service.downloadFile = function (route, params, fileName = '') {
    return this.get(route, { params }, {
        responseType: 'blob', // important
    }).then((response) => {
        // const serverFileName = response.headers['x-suggested-filename']
        // const url = window.URL.createObjectURL(new Blob([response.data]))
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        // link.setAttribute('download', fileName || serverFileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
    })
}

export default service
