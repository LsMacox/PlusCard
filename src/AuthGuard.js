import router from './router'

// import { getToken } from '@/utils/auth' // get token from cookie
import AuthGuard from '@/router/guards/guard-auth'
import LogHandler from '@/router/guards/router-handler-log'

router.beforeEach(async (to, from, next) => {
  LogHandler(to, from)

  if (to.meta && to.meta.auth) {
    AuthGuard(to, from, next)
  } else {
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
})
