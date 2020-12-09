import Vue from 'vue'

export default class ProgramEventBroadcasterHandler {
    static ACTION_ENUM = Object.freeze({
        default: { id: null, text: '-' },
        BONUS_DEBIT: { id: 'BONUS_DEBIT', text: 'Списать бонусы' },
        BONUS_CREDIT: { id: 'BONUS_CREDIT', text: 'Начислить бонусы' },
        NOTIFICATION: { id: 'NOTIFICATION', text: 'Создать рассылку' },
        SEGMENT_IN: { id: 'SEGMENT_IN', text: 'Добавить в сегмент' },
        SEGMENT_OUT: { id: 'SEGMENT_OUT', text: 'Исключить из сегмента' },
        LOG: { id: 'LOG', text: 'Логгирование', disabled: true },

        find (id) {
            return this[id] || this.default
        },
        toList () {
            return [
                this.BONUS_DEBIT,
                this.BONUS_CREDIT,
                this.NOTIFICATION,
                this.SEGMENT_IN,
                this.SEGMENT_OUT,
                this.LOG,
            ]
        },
    });

    constructor (data) {
        Object.assign(this, data)
        Vue.set(this, 'changeActiveAction', false)
    }

    get actionText () {
        return ProgramEventBroadcasterHandler.ACTION_ENUM.find(this.action_type)
            .text
    }

    get idText () {
        return this.isNew ? '-' : this.id
    }
}
