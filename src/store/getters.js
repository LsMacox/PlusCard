const getters = {
  auth: state => state.auth,
  user: state => state['profile/profile'].profile,
  program: (state, getters) => getters['company/program/program'],
  programId: (state, getters) => getters['company/program/programId'],
  drawer: state => state.app.drawer,
  loadingRequest: state => state.app.loadingRequest,
  loadingApp: state => state.app.loadingApp,
  // barColor: state => state.app.barColor,
  // barImage: state => state.app.barImage,
  // sidebar: state => state.app.sidebar,
  // size: state => state.app.size,
  device: state => state['auth/auth'].device,
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs,
}
export default getters
