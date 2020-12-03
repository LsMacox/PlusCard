import ApiService from '@/api/api-client'

export default {
    namespaced: true,
    state: {
        loading: false,
        merchant: null,
        requisites: null,
    },
    mutations: {
        clearState (state) {
            state.loading = false
            state.merchant = null
        },
        loading (state, payload) {
            state.loading = payload
        },
        requisites (state, payload) {
            state.requisites = payload
        },
        merchant (state, payload) {
            state.merchant = payload
        },
    },
    actions: {
        async save ({ commit, state }, details) {
            commit('loading', true)

            const merchant = state.merchant
            let data = null

            if (details.org_type === 'UL') {
                data = {
                    address: details.address,
                    bank_code: details.enterBic,
                    bank_name: details.bankName,
                    correspondent_account: details.correspondentAccount,
                    fio: details.fullNameHead,
                    inn: details.enterTin,
                    kpp: details.enterCheckpoint,
                    name: details.legalName,
                    ogrn: details.enterBin,
                    org_type: details.org_type,
                    phone: details.phoneFax.replace(/[+\- ()]/gm, ''),
                    position: details.positionOfHead,
                    settlement_account: details.checkingAccount,
                }
            } else if (details.org_type === 'IP') {
                data = {
                    address: details.address,
                    bank_code: details.enterBic,
                    bank_name: details.bankName,
                    fio: details.fullNameHead,
                    inn: details.enterTin,
                    name: details.legalName,
                    ogrn: details.enterBin,
                    org_type: details.org_type,
                    phone: details.phoneFax.replace(/[+\- ()]/gm, ''),
                    settlement_account: details.checkingAccount,
                    correspondent_account: details.correspondentAccount,
                }
            } else if (details.org_type === 'FL') {
                data = {
                    address: details.address,
                    fio: details.fullNameHead,
                    inn: details.enterTin,
                    org_type: details.org_type,
                    phone: details.phoneFax.replace(/[+\- ()]/gm, ''),
                }
            }

            Object.assign(merchant, { details: data })

            merchant.org_type = details.org_type
            console.log('save details...')
            console.log(merchant)
            console.log('save details...')
            const result = await ApiService.post('/api-cabinet/merchant', merchant)
            commit('merchant', result)
            commit('loading', false)
        },

        async details ({ commit }) {
            commit('loading', true)
            const result = await ApiService.get('/api-cabinet/merchantDetails')
            // address: "г. Новокузнецк, Кемеровская область, ул. Пролетарская 5"
            // bank_code: "043207612"
            // bank_name: "КЕМЕРОВСКОЕ ОТДЕЛЕНИЕ N8615 ПАО СБЕРБАНК"
            // correspondent_account: "30101810200000000612"
            // fio: "Тарасов Александр Викторович"
            // inn: "4220042814"
            // kpp: "422001001"
            // name: "ООО "Тарк""
            // ogrn: "1104220002105"
            // org_type: "UL"
            // phone: "+73843723723"
            // position: "Директор"
            // settlement_account: "40702810426000010152"
            if (result.details) {
                const requisites = {
                    legalName: result.details.name ?? '',
                    address: result.details.address ?? '',
                    phoneFax: result.details.phone ?? '',
                    positionOfHead: result.details.position ?? '',
                    fullNameHead: result.details.fio ?? '',
                    enterBin: result.details.ogrn ?? '',
                    enterTin: result.details.inn ?? '',
                    enterCheckpoint: result.details.kpp ?? '',
                    checkingAccount: result.details.settlement_account ?? '',
                    enterBic: result.details.bank_code ?? '',
                    bankName: result.details.bank_name ?? '',
                    correspondentAccount: result.details.correspondent_account ?? '',
                    org_type: result.details.org_type ?? '',
                }
                commit('requisites', requisites)
            } else {
                const requisites = {
                    legalName: '',
                    address: '',
                    phoneFax: '',
                    positionOfHead: '',
                    fullNameHead: '',
                    enterBin: '',
                    enterTin: '',
                    enterCheckpoint: '',
                    checkingAccount: '',
                    enterBic: '',
                    bankName: '',
                    correspondentAccount: '',
                    org_type: '',
                }
                commit('requisites', requisites)
            }
            commit('merchant', result)
            commit('loading', false)
        },

    },
    getters: {
        loading (state) {
            return state.loading
        },
        requisites (state) {
            return state.requisites
        },
        merchant (state) {
            return state.merchant
        },
    },
}
