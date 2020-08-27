export default {
    namespaced: true,
    state: {
        loading: false,
        isEndFeed: false,
        feed: []
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.isEndFeed = false
            state.feed = []
        },
        loading (state, payload) {
            state.loading = payload
        },
        set_feed (state, payload) {
            state.feed = payload
        },
        append_feed(state, payload) {
            payload.forEach(element => {
                state.feed.push(element);
            });
            //state.feed.concat(payload)
        },
        isEndFeed(state, payload) {
            state.isEndFeed = payload
        },
    },
    actions: {
        clearFeed (context, params) {
            context.state.feed = [];
            context.state.isEndFeed = false;

        },

        async fetchPageFeed (context, params) {
            try {

                if (context.state.isEnd) return;

                context.
                context.
                context.commit('loading', true)

                const success = await axios.post('/api/widget/feed', params)
                if (success.data==null || success.data.data.length==0) {
                    context.commit('isEndFeed', true)
                } else {
                    if (params.page>0){
                        context.commit('append_feed', success.data.data)
                    } else {
                        context.commit('set_feed', success.data.data)
                    }
                }


                // ////console.log(success)

                context.
                context.commit('loading', false)

            } catch (error) {

                context.
                context.commit('loading', false)

                throw error
            }
        }

    },
    getters: {
        loading (state) {
            return state.loading
        },
        feed (state) {
            return state.feed
        },
        isEndFeed(state){
            return state.isEndFeed
        }
    }
}
