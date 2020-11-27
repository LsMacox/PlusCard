<template>
  <base-side-panel
    v-model="innerActiveSidePanel"
    class="category-side-panel"
    :width="483"
  >
    <div class="category-side-panel__header">
      <p
        class="title-m-bold neutral-900--text"
      >
        Ассортимент
      </p>
      <p class="body-m-regular neutral-700--text">
        Выберите товары или категории товаров, на которые будет действовать акция.
      </p>
      <base-text-field
        v-model="filterBy"
        class="field-search"
        placeholder="Название товара или группы товаров"
        prepend-inner-icon="$iconify_ion-search-outline"
        clear-icon="$iconify_ion-close-circle-outline"
        :prepend-inner-icon-color="this.$vuetify.theme.themes.light['neutral-500']"
        clearable
        hide-details
      />
    </div>
    <div class="category-side-panel__content">
      <div class="content__list">
        <category-list
          v-for="(category, i) in internalCategories"
          :key="i"
          class-name="category_list-main"
          :category="category"
          :index="i"
          :category-selected="categorySelected"
          @addCategory="addCategory"
          @removeCategory="removeCategory"
        />
      </div>
      <v-btn
        class="btn-add"
        color="primary"
        @click="createCategories"
      >
        <iconify-icon
          class="icon"
          icon="plus-circle"
          width="21"
        />
        <p class="body-m-semibold neutral-100--text">
          Добавить позиции в акцию
        </p>
      </v-btn>
    </div>
  </base-side-panel>
</template>

<script>
  import CategoryList from './category-side-panel/category-list'

  export default {
    components: {
      CategoryList,
    },
    model: {
      prop: 'activeSidePanel',
      event: 'changeSidePanel',
    },
    props: {
      activeSidePanel: Boolean,
      categories: {
        type: Array,
        default () {
          return []
        },
      },
      title: {
        type: String,
        default: '',
      },
      subTitle: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        innerActiveSidePanel: this.activeSidePanel,
        filterBy: '',
        internalCategories: JSON.parse(JSON.stringify(this.categories)),
        categorySelected: [],
      }
    },
    computed: {
    },
    watch: {
      innerActiveSidePanel (v) {
        this.$emit('changeSidePanel', v)
      },
      activeSidePanel (v) {
        this.innerActiveSidePanel = v
      },
      filterBy (v) {
        v = String(v).replace(/\s+/g, ' ').replace(/^\s/g, '')

        const copyCategories = JSON.parse(JSON.stringify(this.categories))
        const selectCategories = this.searchCategoriesByFilter(copyCategories, v)

        if (JSON.stringify(this.internalCategories) !== JSON.stringify(selectCategories)) {
          this.internalCategories = selectCategories
        }
      },
    },
    mounted () {},
    methods: {
      searchCategoriesByFilter (categories, filterBy) {
        let selectCategories = this.selectCategoriesByFilter(categories, filterBy)
        selectCategories = this.selectParentCategories(selectCategories)
        return selectCategories
      },
      selectCategoriesByFilter (categories, filterBy) {
        const newCategories = categories.map((category, i, categories) => {
          if (this.$_.has(category, 'categories')) {
            const subCategories = this.selectCategoriesByFilter(category.categories, filterBy)
            category.categories = subCategories
          }

          if (filterBy.length) {
            if (
              category.name
                .toLowerCase()
                .indexOf(filterBy.toLowerCase()) !== -1
            ) {
              category.select = true
            } else {
              category.select = false
            }
          } else {
            category.select = false
          }

          return category
        }, filterBy)

        return newCategories
      },
      selectParentCategories (categories, parentCategory = {}) {
        for (let i = 0; i < categories.length; i++) {
          if (!this.$_.has(categories[i], 'categories')) break

          const subCategories = this.selectParentCategories(categories[i].categories, parentCategory[i])
          categories[i].categories = subCategories

          let subCategoriesSelect = false

          for (let a = 0; a < categories[i].categories.length; a++) {
            if (categories[i].categories[a].select) {
              subCategoriesSelect = true
              break
            }
          }

          if (subCategoriesSelect) {
            categories[i].select = true
          }
        }

        return categories
      },
      categoryClean (category) {
        const newCategory = JSON.parse(JSON.stringify(category))
        if (Object.keys(category).includes('categories')) delete newCategory.categories
        if (Object.keys(category).includes('select')) delete newCategory.select
        return newCategory
      },
      addCategory (category) {
        const selectedIndex = this.selectedCategoryfindIndexByCategory(category)
        if (selectedIndex <= -1) {
          this.categorySelected.push(this.categoryClean(category))
        }
      },
      removeCategory (category) {
        const selectedIndex = this.selectedCategoryfindIndexByCategory(category)
        const categoryIndex = this.categories.findIndex(category => this.isCategoryEqual(category, category))
        this.removeChildCategoriesOfSelected(this.categories[categoryIndex].categories)
        this.categorySelected.splice(selectedIndex, 1)
      },
      selectedCategoryfindIndexByCategory (category) {
        return this.categorySelected.findIndex((categorySelect) => {
          return this.isCategoryEqual(categorySelect, category)
        })
      },
      removeChildCategoriesOfSelected (categories) {
        for (let i = 0; i < categories.length; i++) {
          this.categorySelected.forEach((categorySelected, index) => {
            if (this.isCategoryEqual(categories[i], categorySelected)) {
              this.categorySelected.splice(index, 1)
            }
          })
          if (
            this.$_.has(categories[i], 'categories') &&
            categories[i].categories.length > 0
          ) {
            this.removeChildCategoriesOfSelected(categories[i].categories)
          }
        }
      },
      isCategoryEqual (category1, category2) {
        return (JSON.stringify(this.categoryClean(category1)) === JSON.stringify(this.categoryClean(category2)))
      },
      createCategories () {
        this.$emit('updateCategories', this.categorySelected)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography.sass";

.category-side-panel {
  & ::v-deep .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 0 !important
    }
  }
  .category-side-panel__header {
    padding: 50px 34px 34px 34px;
  }

  .category-side-panel__content {
    padding-right: 34px;
    padding-left: 34px;

    .category_list-main {
      border-bottom: 1px solid $neutral-250;
      padding: 12px 0 12px 0;
      margin-bottom: 0;
      &:nth-child(1) {
        padding-top: 0;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .btn-add {
      margin-top: 33px;
      p {
        margin-bottom: 0;
      }
      .icon {
        margin-right: 8px;
      }
    }
  }
}
</style>
