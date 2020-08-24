const getters = {
  auth: state => state.auth,
  drawer: state => state.app.drawer,
  loadingRequest: state => state.app.loadingRequest,
  program: state => state.program.program,
  // barColor: state => state.app.barColor,
  // barImage: state => state.app.barImage,
  // sidebar: state => state.app.sidebar,
  // size: state => state.app.size,
  // device: state => state.app.device,
  // visitedViews: state => state.tagsView.visitedViews,
  // cachedViews: state => state.tagsView.cachedViews,
  // permission_routes: state => state.permission.routes,
  // errorLogs: state => state.errorLog.logs,
}
export default getters
