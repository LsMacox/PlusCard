import store from '../store'

export default async function (to, from, next) {
    if (store._vm.$session.exists()) {
      let isAuth = false
      let merchantAuth = false
      if (store._vm.$session.get('access_token')) isAuth = true
      if (store._vm.$session.get('merchant_id')) merchantAuth = true

      // console.log('AuthGuard')
      // console.log(store._vm.$session.get('access_token'))
      // console.log(store._vm.$session.get('merchant_id'))

      if (isAuth && merchantAuth) {
        return next()
       }
    }

    return next({
      path: '/login/email',
      query: { redirect: to.fullPath, loginError: true },
    })
}
