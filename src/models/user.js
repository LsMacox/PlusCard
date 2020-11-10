export default class User {
  constructor (profile) {
    Object.assign(this, profile)
  }

  hasProgramPermission (permission, programId) {
    if (this.access_programs) {
      const programIndex = this.access_programs.findIndex(x => x.id === programId)
      if (programIndex >= 0) {
        const program = this.access_programs[programIndex]
        for (let i = 0; i < program.roles.length; i++) {
          const permIndex = program.roles[i].permissions.findIndex(x => x.name === permission)
          if (permIndex >= 0) return true
        }
      }
    }
    return false
  }

  hasProgramRole (role, programId) {
    if (this.access_programs) {
      const programIndex = this.access_programs.findIndex(x => x.id === programId)
      if (programIndex >= 0) {
        const program = this.access_programs[programIndex]
        const roleIndex = program.roles.findIndex(x => x.name === role)
        if (roleIndex >= 0) return true
      }
    }
    return false
  }

  hasProgramAnyRole (programId, roles) {
    for (let i = 0; i < roles.length; i++) {
      const hasRole = this.hasProgramRole(roles[i], programId)
      if (hasRole) return true
    }
    return false
  }
}
