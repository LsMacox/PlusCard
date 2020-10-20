import ApiService from '@/api/api-client'
import Vue from 'vue'

const getDefaultState = () => {
    return {
        moderations: [],
    }
}

// const moderationEntity = {
//   getName: (moderatable) => '-'
// }

// const moderationEntityEnum = {
//   certificate_nominals: {

//   },
//   default: {},
//   find(key){ return this[key] || this.default }
// }

function getEntityName (moderation) {
    switch (moderation.entity_type) {
        case 'certificate_nominals':
            return `Номинал сертификата: ${moderation.entity_name}`
        case 'certificates':
            return `Сертификат: ${moderation.entity_name}`
        case 'programs':
            return `Компания: ${moderation.entity_name}`
        default:
            return moderation.entity_name
    }
}

const certificateNominalFieldMap = {
    nominal: 'Наименование',
    nominal_name: 'Наименование',
    selling_price: 'Цена',
    recommended_retail_price: 'Цена',
}

const certificateFieldMap = {
    name: 'Наименование',
    logo_url: 'Логотип',
    logo_thumb: 'Логотип',
    description: 'Описание',
    short_description: 'Описание',
    activation_rules: 'Правила активации',
    terms_conditions: 'Правила использования',
    terms_of_use: 'Правила использования',
    guaranteed_period: 'Гарантийный период',
}

const programFieldMap = {
    name: 'Наименование',
    chat_welcome: 'Приветственное сообщение',
    slogan: 'Слоган',
    card_name: 'Название карты',
    logo: 'Логотип',
    logo_short: 'Логотип',
    website: 'Сайт',
    description: 'Описание',
    conditions: 'Условия бонусной программы',
    keywords: 'Ключевые слова',
}

function getFieldName (entityType, fieldName) {
    switch (entityType) {
        case 'certificate_nominals':
            return certificateNominalFieldMap[fieldName] || fieldName
        case 'certificates':
            return certificateFieldMap[fieldName] || fieldName
        case 'programs':
            return programFieldMap[fieldName] || fieldName
        default:
            return entityType
    }
}

export default {
    namespaced: true,
    state: getDefaultState(),
    mutations: {
        RESET_STATE (state) {
            Object.assign(state, getDefaultState())
        },

        SET_MODERATIONS (state, payload) {
            state.moderations = payload
        },

        UPDATE_MODERATION (state, payload) {
            var index = state.moderations.findIndex((x) => x.id === payload.id)
            Vue.set(
                state.moderations,
                index,
                Object.assign({}, state.moderations[index], payload),
            )
        },
    },
    actions: {
        Reset ({ commit }) {
            commit('RESET_STATE')
        },

        async GetModerationList ({ commit }, programId) {
            console.log('GetCertList this.programId', programId)
            const result = await ApiService.get(
                '/api-cabinet/company/moderations/list',
                {
                    params: {
                        program_id: programId,
                    },
                },
            )
            commit('SET_MODERATIONS', result)
        },
    },
    getters: {
        moderations (state) {
            return state.moderations
        },
        moderationsMaped (state) {
            return state.moderations.map((x) => {
                Vue.set(x, 'EntityName', getEntityName(x))
                x.fields.map((f) => {
                    Vue.set(
                        f,
                        'FieldName',
                        getFieldName(x.entity_type, f.name),
                    )
                    return f
                })

                return x
            })
        },
    },
}
