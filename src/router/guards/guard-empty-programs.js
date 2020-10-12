import store from '@/store'

export default async function (to, from, next) {
    const programs = store.getters['company/program/programs']
    console.log('guard-empty-program', { programs })
    if (programs && programs.length > 0 ) {
      return next()
    } else {
      if (from.name !== 'Dashboard') {
        return next({
          name: 'Dashboard',
        })
      }
    }
}
