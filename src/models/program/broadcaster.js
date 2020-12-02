import Vue from 'vue'
import { config } from '@/config'
import moment from 'moment'

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
        toList () {
            return [
              this.SECOND,
              this.MINUTE,
              this.HOUR,
              this.DAY,
              this.MONTH,
              this.YEAR,
            ]
          },
    });

    constructor (data) {
        Object.assign(this, data)
        Vue.set(this, 'changeActiveAction', false)
        Vue.set(this, 'action', false)
    }

    dateTimeFormat (dateUtc) {
      return dateUtc ? moment.utc(dateUtc).local().format(config.date.DATETIME_FORMAT) : ''
    }

    // getDateTimeFilter(dateField, search){
    //   return (value, search) =>  this.dateTimeFormat(this[dateField]).toLowerCase().includes(search)  
    // }

    get startAtFormat () {
      return this.dateTimeFormat(this.start_at)
    }

    get finishAtFormat () {
      return this.dateTimeFormat(this.finish_at)
    }

    get lastEmitFormat () {
      return this.dateTimeFormat(this.last_emit)
    }

    get nextEmitFormat () {
      return this.dateTimeFormat(this.next_emit)
    }

    get emitModeText () {
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
