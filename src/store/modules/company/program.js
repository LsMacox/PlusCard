import ApiService from '@/api/api-client'
import VueSession from '@/utils/session'
import Vue from 'vue'

const defaultShop = {
    isNew: true,
    name: '',
    city: '',
    address: '',
    phone: '',
    coords: [],
    lat: '',
    lng: '',
    workTimes: [
        {
            startTime: '',
            endTime: '',
            days: [],
            breakStart: '',
            breakEnd: '',
        },
    ],
}

const getDefaultState = () => {
    return {
        programs: [], // компании продавца
        program: VueSession.get('program'), // сокращенная модель программы
        programModel: {
            socials: {
                vk: null,
                youtube: null,
                facebook: null,
                instagram: null,
            },
        }, // полная модель редактируемой программы
        // shops: [], // торговые точки
        // // -2 все окна закрыты
        // // -1 открыто окно новой торговой точки
        // shopIndex: -2, // индекс открытого окна торговой точки
        // editedShop: defaultShop, // редактируемая торговая точка
        // mapCenter: [53.757592, 87.136173],
        // fullAddress: false,
        // addressErrors: [],
    }
}

const getDefaultShopState = () => {
    return {
        shops: [], // торговые точки
        // -2 все окна закрыты
        // -1 открыто окно новой торговой точки
        shopIndex: -2, // индекс открытого окна торговой точки
        editedShop: defaultShop, // редактируемая торговая точка
        mapCenter: [53.757592, 87.136173],
        fullAddress: false,
        addressErrors: [],
    }
}

const state = Object.assign({}, getDefaultState(), getDefaultShopState())

const mutations = {
    RESET_STATE: (state) => Object.assign(state, getDefaultState()),
    // RESET_SHOP_STATE: (state) => Object.assign(state, getDefaultShopState()),
    SET_PROGRAMS: (state, payload) => (state.programs = payload),
    SET_SHOP_INDEX: (state, payload) => (state.shopIndex = payload),
    SET_EDITED_SHOP: (state, payload) => (state.editedShop = payload),
    SET_MAP_CENTER: (state, payload) => (state.mapCenter = payload),
    SET_FULL_ADDRESS: (state, payload) => (state.fullAddress = payload),
    SET_ADDRESS_ERRORS: (state, payload) => (state.addressErrors = payload),
    SET_PROGRAM (state, payload) {
        state.program = payload
        VueSession.set('program', payload)
    },
    SET_FRIST_PROGRAM (state) {
        let program = null
        if (state.programs && state.programs.length > 0) {
            program = state.programs[0]
        }

        state.program = program
        VueSession.set('program', program)
    },
    DELETE_PROGRAM (state, id) {
        const index = state.programs.findIndex((x) => x.id === id)
        if (index >= 0) {
            state.programs.splice(index, 1)
        }
    },
    SET_PROGRAM_MODEL (state, payload) {
        if (payload.current_moderations && payload.current_moderations.length) {
            payload.current_moderations.forEach((moderation) => {
                moderation.fields.forEach((field) => {
                    if (field.name === 'socials') { payload[field.name] = JSON.parse(field.new) } else payload[field.name] = field.new
                })
            })
        }
        state.programModel = payload
    },
    ADD_IN_PROGRAMS (state, payload) {
        const items = state.programs
        items.push(payload)
    },
    UPDATE_IN_PROGRAMS (state, payload) {
        const items = state.programs
        items.forEach((item, index) => {
            if (item.id === payload.id) Object.assign(items[index], payload)
        })
    },
    SET_SHOPS (state, payload) {
        state.shops = payload
    },
    ADD_IN_SHOPS (state, payload) {
        const items = state.shops
        items.push(payload)
    },
    UPDATE_IN_SHOPS (state, payload) {
        const index = state.shops.findIndex((x) => x.id === payload.id)
        if (index >= 0) Vue.set(state.shops, index, payload)
        // const items = state.shops
        // items.forEach((item, index) => {
        //   if (item.id === payload.id) Object.assign(items[index], payload)
        // })
    },
    REMOVE_IN_SHOPS (state, payload) {
        const items = state.shops
        items.forEach((item, index) => {
            if (item.id === payload.id) items.splice(index, 1)
        })
    },
}

const actions = {
    resetState ({ commit }) {
        commit('RESET_STATE')
    },

    ResetShopState ({ state }) {
        state = Object.assign(state, getDefaultShopState())
    },

    async list ({ commit }) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get('/api-cabinet/company/list')
            console.log('/api-cabinet/company/list')
            console.log(result)
            commit('SET_PROGRAMS', result)
            if (result && result.length) {
                const p = VueSession.get('program')
                // модели программы нет в localStorage
                if (!p) {
                    commit('SET_PROGRAM', result[0])
                    return VueSession.set('program', result[0]) // выход
                }
                const r = result.find((item) => p && item.id === p.id)
                // сравнение моделей программ в ответе и localStorage
                if (JSON.stringify(p) !== JSON.stringify(r)) {
                    // программа из localStorage есть в ответе
                    if (p && r && p.id === r.id) {
                        commit('SET_PROGRAM', r)
                        VueSession.set('program', r)
                        // программы из localStorage нет в ответе = новый логин
                    } else {
                        commit('SET_PROGRAM', result[0])
                        VueSession.set('program', result[0])
                    }
                }
            }
        } catch (error) {
            throw error
        }
    },

    async read ({ commit }, { id }) {
        try {
            const result = await ApiService.get(
                `/api-cabinet/company?id=${id}`,
            )
            // console.log(`/api-cabinet/company?id=${item.id}`)
            // console.log(result)
            commit('SET_PROGRAM_MODEL', result)
        } catch (error) {
            console.error(error)
            throw error
        }
    },

    async setModeration ({ commit }, item) {
        const result = await ApiService.put(
            '/api-cabinet/company/moderation',
            item,
        )
        // console.log('brand/company/setModeration')
        // console.log(success)
        commit('SET_PROGRAM', result)
        this._vm.$notify({
            type: 'success',
            title: 'Настройка компании',
            text: 'Компания отправлена на модерацию',
        })
    },

    async setActive ({ commit }, item) {
        const result = await ApiService.put(
            '/api-cabinet/company/active',
            item,
        )
        // console.log('brand/company/active')
        // console.log(success)
        commit('SET_PROGRAM', result)
        if (result.active) {
            this._vm.$notify({
                type: 'success',
                title: 'Настройка компании',
                text: 'Компания опубликована',
            })
        } else {
            this._vm.$notify({
                type: 'success',
                title: 'Настройка компании',
                text: 'Компания снята с публикации',
            })
        }
    },

    async Delete ({ commit }, programId) {
        await ApiService.delete('/api-cabinet/company/delete', {
            params: {
                program_id: programId,
            },
        })

        commit('DELETE_PROGRAM', programId)
        commit('SET_FRIST_PROGRAM')

        this._vm.$notify({
            type: 'success',
            title: 'Удаление компании',
            text: 'Компания успешно удалена',
        })
    },

    async updateInfo ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put(
                '/api-cabinet/company/info2',
                item,
            )
            // console.log('/api-cabinet/company/info2')
            // console.log(result)
            commit('SET_PROGRAM_MODEL', result)
            commit('UPDATE_IN_PROGRAMS', result)

            this._vm.$notify({
                type: 'success',
                title: 'Компания обновлена',
                text: 'Информация о компании успешно обновлена',
            })
        } catch (error) {
            throw error
        }
    },

    async createShop ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.post(
                '/api-cabinet/company/shop',
                item,
            )
            console.log('/api-cabinet/company/shop')
            console.log(result)
            commit('ADD_IN_SHOPS', result)

            this._vm.$notify({
                type: 'success',
                title: 'Компания обновлена',
                text: 'Торговая точка компании успешно добавлена',
            })
        } catch (error) {
            throw error
        }
    },

    async listShop ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.get(
                `/api-cabinet/company/shop/list?program_id=${item.id}`,
            )
            console.log(`/api-cabinet/company/shop/list?program_id=${item.id}`)
            console.log(result)
            commit('SET_SHOPS', result)
        } catch (error) {
            throw error
        }
    },

    async updateShop ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put(
                '/api-cabinet/company/shop',
                item,
            )
            console.log('/api-cabinet/company/shop')
            console.log(result)
            commit('UPDATE_IN_SHOPS', result)

            this._vm.$notify({
                type: 'success',
                title: 'Компания обновлена',
                text: 'Торговая точка успешно обновлена',
            })
        } catch (error) {
            throw error
        }
    },

    async deleteShop ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.delete(
                `/api-cabinet/company/shop?id=${item.id}`,
            )
            console.log(`/api-cabinet/company/shop?id=${item.id}`)
            console.log(result)
            commit('REMOVE_IN_SHOPS', result)

            this._vm.$notify({
                type: 'success',
                title: 'Компания обновлена',
                text: 'Торговая точка успешно удалена',
            })
        } catch (error) {
            throw error
        }
    },

    async updateCRM ({ commit, dispatch, rootState }, { id, smsText }) {
        const result = await ApiService.put('/api-cabinet/company/crm', {
            id,
            sms_text: smsText,
        })
        return result
    },

    async updateCRMSmsTest ({ commit, dispatch, rootState }, { id, smsText }) {
        const result = await ApiService.post('/api-cabinet/company/crm/sms/test', {
            id,
            sms_text: smsText,
        })
        return result
    },

    async updateChat ({ commit, dispatch, rootState }, { programId, canWrite, realChatName, chatWelcome }) {
      const result = await ApiService.put('/api-cabinet/company/chat', {
          id: programId,
          can_write: canWrite,
          real_chat_name: realChatName,
          chat_welcome: chatWelcome,
      })
      return result
  },

    async updateContact ({ commit }, item) {
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await ApiService.put(
                '/api-cabinet/company/contact',
                item,
            )
            // console.log('/api-cabinet/company/contact')
            // console.log(result)
            commit('SET_PROGRAM_MODEL', result)
            commit('UPDATE_IN_PROGRAMS', result)

            this._vm.$notify({
                type: 'success',
                title: 'Компания обновлена',
                text: 'Контакты компании успешно обновлены',
            })
        } catch (error) {
            throw error
        }
    },

    async CreateProgram ({ commit }, program) {
        const result = await ApiService.post(
            '/api-cabinet/company/create',
            program,
        )
        commit('ADD_IN_PROGRAMS', result)
        commit('SET_PROGRAM', result)
        return result
    },

    GenNewShop () {
        const newShop = Object.copy(defaultShop)
        newShop.id = this._vm.$uuid()
        return newShop
    },
}

const getters = {
    programs: (state) => state.programs,
    program: (state) => state.program,
    programId: (state) => (state.program ? state.program.id : null),
    programModel: (state) => state.programModel,
    menu: (state) => {
        return [
            {
                id: 'info',
                name: 'Общая информация',
                route: `/company/${state.programModel.id}/info`,
            },
            {
                id: 'shop',
                name: 'Точки продаж',
                route: `/company/${state.programModel.id}/shop`,
            },
            {
                id: 'contact',
                name: 'Контактные данные',
                route: `/company/${state.programModel.id}/contact`,
            },
        ]
    },
    shops: (state) => state.shops,
    shopIndex: (state) => state.shopIndex,
    editedShop: (state) => state.editedShop,
    mapCenter: (state) => state.mapCenter,
    fullAddress: (state) => state.fullAddress,
    addressErrors: (state) => state.addressErrors,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}
