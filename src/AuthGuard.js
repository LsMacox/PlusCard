import router from './router'

// import { getToken } from '@/utils/auth' // get token from cookie
import AuthGuard from '@/router/guard-auth'

router.beforeEach(async (to, from, next) => {
  // start progress bar
  // NProgress.start()
  console.log('AuthGuard', to, from)

  if (to.meta && to.meta.auth) {
    AuthGuard(to, from, next)
  } else {
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  // NProgress.done()
})
