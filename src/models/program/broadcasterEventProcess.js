import Vue from 'vue'
import { config } from '@/config'
import moment from 'moment'
import ProgramEventBroadcasterHandler from './broadcasterHandler'

export default class ProgramEventBroadcasterEventProcess {
    static STATUS_ENUM = Object.freeze({
        default: { id: null, text: '-' },
        new: {
            id: 'new',
            text: 'На обработке',
            color: 'neutral-500',
            icon: '$icons_status-cancel',
        },
        run: {
            id: 'run',
            text: 'Обрабатывается',
            color: 'warning-500',
            icon: '$icons_status-wait',
        },
        done: {
            id: 'done',
            text: 'Обработано',
            color: 'success-500',
            icon: '$icons_status-success',
        },
        fail: {
            id: 'fail',
            text: 'Ошибка',
            color: 'error-500',
            icon: '$icons_status-error',
        },
        cancel: { id: 'cancel', text: 'Отмена' },
        find (id) {
            return this[id] || this.default
        },
        toList () {
            return [this.new, this.run, this.done, this.fail, this.cancel]
        },
    });

    constructor (data) {
        Object.assign(this, data)
        this.handler = new ProgramEventBroadcasterHandler(data.handler)
    }
}
