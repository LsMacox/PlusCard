import Vue from 'vue'
import { config } from '@/config'
import moment from 'moment'

export default class ProgramEventBroadcasterEventProcess {
  static STATUS_ENUM = Object.freeze({
    default: { id: null, text: '-' },
    new: { id: 'new', text: 'На обработке' },
    run: { id: 'run', text: 'Обрабатывается' },
    done: { id: 'done', text: 'Обработано' },
    fail: { id: 'fail', text: 'Ошибка' },
    cancel: { id: 'cancel', text: 'Отмена' },
    find (id) {
        return this[id] || this.default
    },
    toList () {
        return [
            this.new,
            this.run,
            this.done,
            this.fail,
            this.cancel,
        ]
    },
  })

    constructor (data) {
        Object.assign(this, data)
    }
}
