export default {
    data () {
        return {
            tableSettings: {
                // vuetify
                page: 1,
                itemsPerPage: 25,
                sortBy: [],
                sortDesc: [],
                groupBy: [],
                groupDesc: [],
                mustSort: false,
                multiSort: false,
                // сортировка по одному полю (base-table)
                sort: {
                  sortBy: 'id',
                  descending: 'ascending',
                },
            },
            paginationOptions: [
                { text: '25 на странице', value: 25 },
                { text: '50 на странице', value: 50 },
                { text: '100 на странице', value: 100 },
                { text: '150 на странице', value: 150 },
                { text: '250 на странице', value: 250 },
                { text: '500 на странице', value: 500 },
            ],
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
            if (!v) v = {}
            if (!v[key]) {
                if (!value) value = this.tableSettings
                this.setDataTableSetting(key, value)
            }
            return JSON.parse(localStorage.getItem('tables'))[key]
        },
        setDataTableSetting (key, value) {
            let v = JSON.parse(localStorage.getItem('tables'))
            if (!v) v = {}
            v[key] = value
            localStorage.setItem('tables', JSON.stringify(v))
        },
    },
}
