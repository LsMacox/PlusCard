import Vue from 'vue'
import { config } from '@/config'
import moment from 'moment'

export default class Account {
    constructor (data) {
        Object.assign(this, data)
    }

    dateTimeFormat (dateUtc) {
      return dateUtc ? moment.utc(dateUtc).local().format(config.date.DATETIME_FORMAT) : ''
    }

    get searchField () {
      return [ this.id, this.user_id, this.client_name, this.UserName, this.phone, this.email].join(';')
    }

    get phone () {
      return this.user && this.user.phone
    }

    get email () {
      return this.user && this.user.email
    }

    get UserName () {
      if (this.user) {
        if (this.user.UserName) {
          return this.user.UserName
        } else {
          if (this.user.name || this.user.lastname || this.user.middlename) {
            return [this.user.lastname, this.user.name, this.user.middlename].join(' ').trim()
          } else {
            if (this.user.phone) return this.user.phone
            else if (this.user.email) return this.user.email
            else return 'Пользователь'
          }
        }
      } else {
        return ''
      }
    }
}
