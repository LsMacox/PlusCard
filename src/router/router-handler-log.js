export function IsDebugQuery (route) {
  return route.query.debug === 'true' || +route.query.debug === 1
}

export default async function (to, from) {
    if (IsDebugQuery(to)) {
      console.info('log=>info')
      window.console.log = window.console.info
    }
}
