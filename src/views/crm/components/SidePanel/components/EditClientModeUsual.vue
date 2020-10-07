<template>
  <div>
    <div class="mode-usual__contacts">
      <div class="contacts__block-right">
        <div class="contacts-full_name">
          <p class="title-m-bold">
            {{ clientData.name }}
          </p>
          <p class="title-m-bold">
            {{ clientData.surname }}
          </p>
        </div>
        <div class="contacts-online">
          <p class="body-s-semibold neutral-600--text">
            Был(а) в сети {{ $moment(clientData.online).format('DD.MM.YYYY в HH:mm') }}
          </p>
        </div>
        <div class="contacts-info">
          <ul class="contacts-info__list">
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="ion-phone-portrait-outline"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.phone }}
              </p>
            </li>
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="ion-mail-outline"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.email }}
              </p>
            </li>
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="ion-barcode-outline"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.code }}
              </p>
            </li>
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="feather-credit-card"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.card }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="contacts__block-left">
        <img
          :src="[clientData.img_avatar ? clientData.img_avatar : '']"
        >
      </div>
    </div>
    <div class="mode-usual__bonus-accounts">
      <div class="bonus-accounts__header">
        <p class="body-l-semibold">
          Бонусные счета
        </p>
      </div>
      <div class="bonus-accounts__cards">
        <div class="bonus-accounts__card">
          <div class="card__header">
            <p class="card__header-title body-l-semibold">
              Бонусные рубли
            </p>
            <p class="card__header-count title-m-bold success--text">
              {{ '1364' | spacesBetweenNumbers }}
            </p>
            <div class="card__header-control">
              <v-btn
                class="control-btn"
                color="primary-100"
              >
                <iconify-icon
                  icon="feather-minus"
                  width="15"
                />
              </v-btn>
              <v-btn
                class="control-btn"
                color="primary-100"
              >
                <iconify-icon
                  icon="eva-plus-outline"
                  width="15"
                />
              </v-btn>
            </div>
          </div>
          <div
            v-if="false"
            class="card__body"
          >
            <div class="card__body-form">
              <v-select
                :items="bonusRubleItems"
                label="Выберите операцию"
                outlined
              />
              <v-text-field
                v-model="bonusRubleCrib"
                v-mask="'Списать: ###############'"
                class="panel-crm__form-input card__body-input"
                type="text"
                placeholder="Списать:"
                outlined
              />
              <div class="panel-crm__form-textarea">
                <v-textarea
                  v-model="bonusRubleDescription"
                  class="panel-crm__form-input card__body-input"
                  rows="4"
                  placeholder="Введите комментарий (необязательно)"
                  outlined
                  auto-grow
                />
                <div class="textarea---angle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      clientData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data () {
      return {
        bonusRubleCrib: 0,
        bonusRubleDescription: '',
        bonusRubleItems: ['Покупка'],
      }
    },
  }
</script>
