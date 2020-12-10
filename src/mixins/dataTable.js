export default {
    data () {
      return {
          tableSettings: {
              sort: {
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
            let v = JSON.parse(localStorage.getItem('tables'))
            if (!v) {
                v = {}
            }
            if (!v[key]) {
                if (!value) value = this.tableSettings
                this.setDataTableSetting(key, value)
            }
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
