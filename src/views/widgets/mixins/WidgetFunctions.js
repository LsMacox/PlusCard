export default {
  computed: {
    theme () {
      const vueTheme = this.$vuetify.theme
      if (vueTheme.isDark) {
        return vueTheme.themes.dark
      }
      return vueTheme.themes.light
    },
  },
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
    declOfNum (number, titles) {
      number = Number(number)
      const cases = [2, 0, 1, 1, 1, 2]
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    },
    prepareDecimalNumberToDisplay (v) {
      const [int, dec] = v.toString().split('.')
      if (dec === undefined) return int
      return int + ',' + dec
    },
    getPercentToDisplay (percent) {
      return percent > 0 ? `+${percent}%` : `${percent}%`
    },
  },
}
