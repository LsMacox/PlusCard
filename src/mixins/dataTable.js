export default {
    data () {
      return {
          tableSettings: {
              pagination: {
                  sortBy: 'id',
                  descending: 'ascending',
              },
          },
      }
    },
    methods: {
        getOffset (page, limit) {
            return (page * limit) - limit
        },
        getSortable (sortBy, sortDesc) {
            let sortable = null
            if (sortBy && sortDesc &&
                Array.isArray(sortBy) && Array.isArray(sortDesc) &&
                sortBy.length === sortDesc.length) {
                //
                sortable = []
                sortBy.forEach((item, i) => {
                    sortable.push({
                        field: item,
                        sort: sortDesc[i] ? 'DESC' : 'ASC',
                    })
                })
            }
            return sortable
        },
        getDataTableSetting (key, value = null) {
            console.log(value)
            let v = JSON.parse(localStorage.getItem('tables'))
            if (!v) {
                v = {}
            }
            if (!v[key]) {
                if (!value) value = this.tableSettings
                v[key] = value
                this.setDataTableSetting(key, v)
            }
            console.log("JSON.parse(localStorage.getItem('tables'))[key]")
            console.log(JSON.parse(localStorage.getItem('tables'))[key])
            return JSON.parse(localStorage.getItem('tables'))[key]
        },
        setDataTableSetting (key, value) {
            let v = JSON.parse(localStorage.getItem('tables'))
            if (!v) {
                v = {}
            }
            v[key] = value
            localStorage.setItem('tables', JSON.stringify(v))
        },
    },
}
