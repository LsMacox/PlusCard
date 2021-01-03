<template>
  <div
    v-click-outside="close"
    class="app--component-emoji"
  >
    <div class="emoji-box">
      <div class="emoji__header">
        <base-text-field
          v-model="search"
          class="field-search"
          placeholder="Поиск смайлов"
          prepend-inner-icon="$iconify_ion-search-outline"
          clear-icon="$iconify_ion-close-circle-outline"
          :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
          clearable
          hide-details
        />
      </div>
      <div class="emoji__content">
        <div class="content__title">
          <p class="body-s-semibold neutral-500--text">
            {{ activeCategory.name }}
          </p>
        </div>
        <div
          id="emoji-grids"
          class="content__grids"
        >
          <div
            v-if="search && search.length"
            class="content__grid"
          >
            <div
              v-if="search && search.length"
              id="emoji-grid-filtered"
              class="emoji-grid"
            >
              <div
                v-for="(emoji, idx) in emojiFiltered"
                :key="idx"
                class="column"
              >
                <p @click="addCharacterInTextArea(emoji.emoji); addInEmojiHistory(emoji);">
                  {{ emoji.emoji }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-for="category in categories"
            v-show="category.active && (!search || !search.length)"
            :key="category.id"
            class="content__grid"
          >
            <div
              v-if="category.id !== 1"
              :id="`emoji-grid-${category.id}`"
              class="emoji-grid"
            >
              <div
                v-for="(emoji, idx) in category.emoji"
                :key="idx"
                class="column"
              >
                <p @click="addCharacterInTextArea(emoji.emoji); addInEmojiHistory(emoji);">
                  {{ emoji.emoji }}
                </p>
              </div>
            </div>
            <div
              v-else-if="emojiHistory.length"
              id="emoji-grid-history"
              class="emoji-grid"
            >
              <div
                v-for="(emoji, idx) in emojiHistory"
                :key="idx"
                class="column"
              >
                <p @click="addCharacterInTextArea(emoji.emoji)">
                  <span class="emoji-character">{{ emoji.emoji }}</span>
                </p>
              </div>
            </div>
            <template v-else>
              <p class="body-s-semibold neutral-600--text">
                Нету истории смайликов!
              </p>
            </template>
          </div>
        </div>
      </div>
      <div class="emoji__footer">
        <ul class="footer__list">
          <li
            v-for="category in categories"
            :key="category.id"
            :class="['footer__item', {active: category.active}]"
            @click="chooseCategory(category.id)"
          >
            <v-icon
              v-if="Object.keys(category).includes('icon')"
              :size="Object.keys(category).includes('size') ? category.size : '21'"
            >
              {{ category.icon }}
            </v-icon>
            <div
              v-if="Object.keys(category).includes('svg')"
              :class="['logo', {active: category.active}]"
              :style="`-webkit-mask: url(${category.svg}) no-repeat center;mask: url(${category.svg}) no-repeat center;`"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // json smiles
  import JsonEmoji from '@/assets/json/emoji.json'

  // Mixins
  import MixinIndex from '@/views/communications/mixins/index.js'

  // other
  import Twemoji from 'twemoji'
  import FuzzySearch from 'fuzzy-search'

  export default {
    mixins: [
      MixinIndex,
    ],
    data () {
      return {
        search: '',
        categories: [
          { id: 1, name: 'Недавние', icon: '$iconify_feather-clock', active: true },
          { id: 2, name: 'Смайлы и люди', icon: '$iconify_feather-smile', emoji: [], active: false },
          { id: 3, name: 'Животные', svg: require('@/assets/icons/animal.svg'), emoji: [], active: false },
          { id: 4, name: 'Еда', svg: require('@/assets/icons/fast-food-outline.svg'), emoji: [], active: false },
          { id: 5, name: 'Занятия', icon: '$iconify_ion-basketball-outline', size: 22, emoji: [], active: false },
          { id: 6, name: 'Транспорт', icon: '$iconify_ion-car-outline', size: 23, emoji: [], active: false },
          { id: 7, name: 'Объекты', icon: '$iconify_ion-bulb-outline', emoji: [], active: false },
          { id: 8, name: 'Фигруры', icon: '$iconify_feather-circle', emoji: [], active: false },
          { id: 9, name: 'Флаги', icon: '$iconify_ion-flag-outline', emoji: [], active: false },
        ],
        emojiVerSix: [],
        emojiHistory: [],
      }
    },
    computed: {
      activeCategory () {
        return this.categories.find(c => c.active)
      },
      emojiSearcher () {
        if (this.activeCategory.id === 1) {
          return new FuzzySearch(
            this.emojiVerSix,
            ['description', 'tags.*'],
            {
              caseSensitive: false,
              sort: true,
            },
          )
        }
        return new FuzzySearch(
          this.activeCategory.emoji,
          ['description', 'tags.*'],
          {
            caseSensitive: false,
            sort: true,
          },
        )
      },
      emojiFiltered () {
        const search = String(this.search).replace(/\s+/g, ' ').replace(/^\s/g, '')

        if (this.search && search.length) {
          return this.emojiSearcher.search(search.toLowerCase())
        }

        return []
      },
    },
    updated () {
      this.updateEmojiImgById('emoji-grid-filtered')

      if (this.categories[0].active) {
        this.updateEmojiImgById('emoji-grid-history')
      } else {
        const activeCategoryId = this.categories.find(c => c.active).id
        this.updateEmojiImgById('emoji-grid-' + activeCategoryId)
      }
    },
    mounted () {
      const emojiHistory = JSON.parse(localStorage.getItem('chat-emoji-history'))
      if (emojiHistory) {
        this.emojiHistory = JSON.parse(localStorage.getItem('chat-emoji-history'))
      }
      this.$store.commit('chat/sendbox/emojiHistory', this.emojiHistory)
      this.$nextTick(() => {
        this.updateEmojiImgById('emoji-grid-history')
      })

      JsonEmoji.forEach((em) => {
        if (em.unicode_version === '6.0') {
          this.emojiVerSix.push(em)
          switch (em.category) {
            case 'Smileys & Emotion':
              this.categories[1].emoji.push(em)
              break
            case 'Animals & Nature':
              this.categories[2].emoji.push(em)
              break
            case 'Food & Drink':
              this.categories[3].emoji.push(em)
              break
            case 'Travel & Places':
              this.categories[5].emoji.push(em)
              break
            case 'Objects':
              this.categories[6].emoji.push(em)
              break
            case 'Symbols':
              this.categories[7].emoji.push(em)
              break
            case 'Activities':
              this.categories[4].emoji.push(em)
              break
            case 'Flags':
              this.categories[8].emoji.push(em)
              break
          }
        }
      })

      this.categories.map(c => {
        c.emoji = Array.from(new Set(c.emoji))
        return c
      })
    },
    methods: {
      chooseCategory (categoryId) {
        this.categories.forEach((category, idx) => {
          this.categories[idx].active = false
        })

        const categoryIdx = this.categories.findIndex(c => c.id === categoryId)
        this.categories[categoryIdx].active = true
      },
      close () {
        this.$store.commit('chat/sendbox/isEmoji', false)
      },
      updateEmojiImgById (id) {
        const el = document.getElementById(id)
        if (el) {
          Twemoji.parse(el)
        }
      },
      addCharacterInTextArea (emojiCharacter) {
        const messageText = this.$store.getters['chat/sendbox/messageText']
        this.$store.commit('chat/sendbox/messageText', messageText + emojiCharacter)
      },
      addInEmojiHistory (emoji) {
        const emojiIdx = this.emojiHistory.findIndex(em => em.emoji === emoji.emoji)

        if (emojiIdx === -1) {
          if (this.emojiHistory.length >= 40) {
            this.emojiHistory.pop()
          }
          this.emojiHistory.unshift(emoji)
        } else {
          this.emojiHistory.splice(emojiIdx, 1)
          this.emojiHistory.unshift(emoji)
        }
        this.$store.commit('chat/sendbox/emojiHistory', this.emojiHistory)
        localStorage.setItem('chat-emoji-history', JSON.stringify(this.emojiHistory))
        this.emojiHistory = []
        this.$nextTick(() => {
          this.emojiHistory = this.$store.getters['chat/sendbox/emojiHistory']
        })
      },
    },
  }
</script>
