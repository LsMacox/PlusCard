<template>
<div>
  
    <v-layout row wrap>
        <v-flex xs12>

            <div class="block">

                <v-layout row wrap>
                    <v-flex xs12 md3 class="field">
                        <v-select
                                v-model="type"
                                :items="types"
                                item-value="id"
                                item-text="name"
                                :color="colors.greenLight"
                                label="Тип рассылки"
                        ></v-select>

                        <!--
                        <v-select
                                v-if="profile.id == 2"
                                v-model="type"
                                :items="typesAdmin"
                                item-value="id"
                                item-text="name"
                                :color="colors.greenLight"
                                label="Тип рассылки"
                        ></v-select>
                        -->
                    </v-flex>

                    <v-flex xs12 md9 class="field">
                    </v-flex>

                </v-layout>

                <v-layout
                        v-if="type"
                        row
                        wrap
                >
                    <v-flex xs12 md3 class="field">

                        <v-textarea
                                v-if="type == 1"
                                v-model="phones"
                                :color="colors.greenLight"
                                label="Список телефонов"
                                hint="Введите номера телефонов через запятую"
                                persistent-hint
                                :error-messages="phonesErrors"
                                @blur="$v.phones.$touch()"
                        ></v-textarea>

                        <div
                                v-if="type == 2"
                        >Сообщение будет отправлено выбранной группе пользователей</div>

                        <div
                                v-if="type == 3"
                        >Сообщение будет отправлено всем держателям карт программы</div>

                        <div
                                v-if="type == 4"
                        >Сообщение будет отправлено всем пользователям системы "Плюс"</div>

                    </v-flex>
                    <v-flex xs12 md9 class="field">
                        <v-textarea
                                v-model="message"
                                :color="colors.greenLight"
                                label="Сообщение рассылки"
                                :error-messages="messageErrors"
                                @blur="$v.message.$touch()"
                        ></v-textarea>
                    </v-flex>
                </v-layout>

                <div
                        v-if="type"
                        class="actions"
                >
                    <v-spacer></v-spacer>
                    <v-btn
                            :color="colors.buttons.cancel"
                            round
                            large
                            @click="clear()"
                    ><span :style="'color:' + colors.white">Очистить поля</span></v-btn>
                    <v-btn
                            v-if="type != 1"
                            :color="colors.buttons.success"
                            round
                            large
                            :loading="loadingRequest"
                            :disabled="!checkValidate"
                            @click="send()"
                    ><span :style="'color:' + colors.white">Отправить</span></v-btn>
                    <v-btn
                            v-if="type == 1"
                            :color="colors.buttons.success"
                            round
                            large
                            :loading="loadingRequest"
                            :disabled="!checkValidate2"
                            @click="send()"
                    ><span :style="'color:' + colors.white">Отправить</span></v-btn>
                </div>

            </div>

        </v-flex>
    </v-layout>
  
</div>
</template>

<script>


export default {
    data () {
        return {
            type: null,
            phones: null,
            message: null,
            types: [
                { id: 1, name: 'Тестовая'},
                { id: 2, name: 'Групповая'},
                { id: 3, name: 'Всем участникам программы'}
            ],
            typesAdmin: [
                { id: 1, name: 'Тестовая'},
                { id: 2, name: 'Групповая'},
                { id: 3, name: 'Всем участникам программы'},
                { id: 4, name: 'Всем пользователям PLUS'}
            ]
        }
    },
    validations: {
        message: {
            // required
        },
        phones: {
            // required
        }
    },
    computed: {
        loadingRequest () {
            return this.$store.getters['template/shared/loadingRequest']
        },
        colors () {
            return this.$store.getters['template/colors/colors']
        },
        profile () {
            return this.$store.getters.getProfile
        },
        program () {
            return this.$store.getters['brand/program/program']
        },
        currentProgramId: {
            get () {
                return this.$store.getters.currentProgramId
            },
            set (val) {
                return this.$store.commit('currentProgramId', val)
            }
        },
        messageErrors () {
            const errors = []
            if (!this.$v.message.$dirty) return errors
            !this.$v.message.required && errors.push('Поле "Сообщение рассылки" обязательно')
            return errors
        },
        phonesErrors () {
            const errors = []
            if (!this.$v.phones.$dirty) return errors
            !this.$v.phones.required && errors.push('Список телефонов не должен быть пустым')
            return errors
        },
        checkValidate () {
            if (this.$v.message.required) return true
            return false
        },
        checkValidate2 () {
            if (this.$v.message.required && this.$v.phones.required) return true
            return false
        }
    },
    methods: {
        clear () {
            this.phones = null
            this.message = null
            this.$v.$reset()
        },
        send () {
            this.$store.dispatch('auth/auth/refreshTokens').then(auth => {
                if (!auth) return
                const message = {
                    program_id: this.currentProgramId,
                    type: this.type,
                    phones: this.phones,
                    message: this.message
                }
                //////console.log(message)
                this.$store.dispatch('sending/sending/send', message)
            })
        }
    }
}
</script>

<style scoped>
    .block {
        margin: 20px 0 0 20px;
        padding: 10px;
        border-radius: 5px;
        background-color: #ffffff;
    }

    .field {
        padding: 0 5px;
    }

    .actions {
        display: flex;
    }
</style>