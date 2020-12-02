import ApiService from '@/api/api-client'
import Vue from 'vue'
import ProgramEventBroadcaster from '@/models/program/broadcaster'

function eventFilter (event) {
    return (item) => {
        return item.rules && item.rules.event === event
    }
}
function activeFilter (active) {
    return (item) => {
        return item.bonus_score && item.bonus_score.active === active
    }
}

export default {
    namespaced: true,
    state: {
        broadcasters: [],
    },
    mutations: {
        SET_BROADCASTERS (state, payload) {
            state.broadcasters = payload
        },
        ADD_BROADCASTER (state, newItem) {
            state.broadcasters.push(newItem)
        },
        UPDATE_BROADCASTER (state, item) {
            const index = state.broadcasters.findIndex((x) => x.id === item.id)
            if (index >= 0) {
                Vue.set(state.broadcasters, index, Object.assign({}, state.broadcasters[index], item))
            }
        },
        REMOVE_BROADCASTER (state, id) {
            const index = state.broadcasters.findIndex((x) => x.id === id)
            if (index >= 0) state.broadcasters.splice(index, 1)
        },
        SYNC_HANDLER (state, handler) {
            const index = state.broadcasters.findIndex((x) => x.id === handler.broadcaster_id)
            if (index >= 0) {
                const indexHandler = state.broadcasters[index].handlers.findIndex((x) => x.id === handler.id)
                if (indexHandler >= 0) {
                    const handler = state.broadcasters[index].handlers[indexHandler]
                    Vue.set(state.broadcasters[index].handlers, indexHandler, Object.assign({}, handler, handler))
                } else {
                    state.broadcasters[index].handlers.push(handler)
                }
            }
        },
        REMOVE_HANDLER (state, handler) {
            const index = state.broadcasters.findIndex((x) => x.id === handler.broadcaster_id)
            if (index >= 0) {
                const broadcaster = state.broadcasters[index]
                const indexHandler = broadcaster.handlers.findIndex((x) => x.id === handler.id)
                if (indexHandler >= 0) broadcaster.handlers.splice(indexHandler, 1)
            }
        },
    },
    actions: {
        async GetList ({ commit }, programId) {
            const result = await ApiService.get(
                `/api-cabinet/program/account/event/broadcaster/list?program_id=${programId}`,
            )
            commit('SET_BROADCASTERS', result)
        },

        async CheckClientFilter ({ commit }, filter) {
            const result = await ApiService.post('/api-cabinet/program/account/event/broadcaster/filter/validate', filter)
            return result
        },

        async DeleteBroadcaster ({ commit }, id) {
            await ApiService.delete(
                `/api-cabinet/program/account/event/broadcaster?broadcaster_id=${id}`,
            )

            commit('REMOVE_BROADCASTER', id)

            this._vm.$notify({
                title: 'Удаление активности',
                text: 'Активность успешно удалена',
                type: 'success',
            })
        },

        async CreateBroadcaster ({ commit }, broadcaster) {
            const result = await ApiService.post(
                '/api-cabinet/program/account/event/broadcaster',
                broadcaster,
            )

            commit('ADD_BROADCASTER', result)
            this._vm.$notify({
                title: 'Создание активности',
                text: `Активность "${result.name}" успешно создана`,
                type: 'success',
            })
            return result
        },

        async UpdateBroadcaster ({ commit }, broadcaster) {
            const result = await ApiService.put(
                '/api-cabinet/program/account/event/broadcaster',
                broadcaster,
            )

            commit('UPDATE_BROADCASTER', result)

            this._vm.$notify({
                title: 'Обновление активности',
                text: `Активность "${result.name}" успешно обновлена`,
                type: 'success',
            })
        },

        async SetActiveBroadcaster ({ state, commit }, { id, active }) {
            const result = await ApiService.put(
                '/api-cabinet/program/account/event/broadcaster/active',
                {
                    broadcaster_id: id,
                    active,
                },
            )

            commit('UPDATE_BROADCASTER', result)

            this._vm.$notify({
                title: 'Активность',
                text: `Активность ${active ? 'включена' : 'выключена'}`,
                type: 'success',
            })
        },

        async CreateBroadcasterHandler ({ commit }, handler) {
            const result = await ApiService.post(
                '/api-cabinet/program/account/event/broadcaster/handler',
                handler,
            )

            commit('SYNC_HANDLER', result)
            this._vm.$notify({
                title: 'Создание обработчик создан',
                // text: `Активность "${result.name}" успешно создана`,
                type: 'success',
            })
        },

        async SetActiveBroadcasterHandler ({ state, commit }, { handlerId, active }) {
            const result = await ApiService.put(
                '/api-cabinet/program/account/event/broadcaster/handler/active',
                {
                    handler_id: handlerId,
                    active,
                },
            )

            commit('SYNC_HANDLER', result)

            this._vm.$notify({
                title: 'Обработчик',
                text: `Обработчик ${active ? 'включен' : 'выключен'}`,
                type: 'success',
            })
        },

    },
    getters: {
        broadcasters (state) {
            return state.broadcasters.map(item => {
                return new ProgramEventBroadcaster(item)
            })
        },
    },
}
