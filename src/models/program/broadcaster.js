import Vue from 'vue'

export default class ProgramEventBroadcaster {
    static EMIT_MODE_ENUM = Object.freeze({
        MANUAL: { id: 'MANUAL', text: 'Ручной запуск' },
        PERIOD: { id: 'PERIOD', text: 'Периодический запуск' },
        EVENT: { id: 'EVENT', text: 'Запуск по событию' },
        PARENT: { id: 'PARENT', text: 'Запуск по родителя' },
    });

    static PERIOD_ENUM = Object.freeze({
        ONCE: { id: 'ONCE', text: 'Единоразово' },
        SECOND: { id: 'SECOND', text: 'Секунда' },
        MINUTE: { id: 'MINUTE', text: 'Минута' },
        HOUR: { id: 'HOUR', text: 'Час' },
        DAY: { id: 'DAY', text: 'День' },
        MONTH: { id: 'MONTH', text: 'Месяц' },
        YEAR: { id: 'YEAR', text: 'Год' },
        find (id) {
            return this[id] || this.default
        },
    });

    constructor (data) {
        Object.assign(this, data)
        Vue.set(this, 'changeActiveAction', false)
    }

    get EmitModeText () {
        switch (this.emit_mode) {
            case ProgramEventBroadcaster.EMIT_MODE_ENUM.MANUAL.id:
                return 'Ручной'
            case ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id:
                if (this.period) {
                    return this.period.type === ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id ? 'единоразово'
                    : `каждую ${this.period.value} ${ProgramEventBroadcaster.PERIOD_ENUM[this.period.type]?.text}`
                } else {
                    return ''
                }
            case ProgramEventBroadcaster.EMIT_MODE_ENUM.EVENT.id:
                return this.listen_event_setting
                    ? `по событию: ${this.listen_event_setting.name}`
                    : this.listen_event
            default:
                return '?'
        }
    }
}
