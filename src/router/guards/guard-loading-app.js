import store from '@/store'

export default async function (to, from, next) {
  try {
    await store.dispatch('app/LoadingApp')
    return next()
  } catch (error) {
    return next({
      name: 'Login',
    })
  }
}
