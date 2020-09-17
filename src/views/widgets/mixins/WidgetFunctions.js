export default {
  methods: {
    relativeChange (num1, num2) {
      if (num2 > 0) {
        return Math.round((num1 - num2) / num2 * 100)
      }
      return 0
    },
    prepareDiagramLabels (data, obj) {
      var objArrVal = this.$_.map(data, obj)
      var diagramLabels = []
      objArrVal.forEach((val, index) => {
        const label = {
          count: val,
          start_period: data[index].date_start,
          end_period: data[index].date_end,
        }
        diagramLabels.push(label)
      })
      return diagramLabels
    },
    generateClassesByPrefix (mainClass, prefix) {
      const classes = mainClass.split(' ')
      let resClass = ''
      classes.forEach(classEl => {
        if (prefix !== undefined) resClass += classEl + prefix + ' '
        else resClass += classEl + ' '
      })
      return resClass.slice(0, -1)
    },
  },
}
