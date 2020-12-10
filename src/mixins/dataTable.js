export default {
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
    },
}
