<template>
  <ul
    class="category__list"
    :class="className.length ? className : ''"
  >
    <li
      class="category__item"
      :class="{active: isSelect}"
    >
      <div
        class="item__header"
        :style="!isExistCategories ? 'margin-bottom: 0px' : ''"
        @click="isSelect = !isSelect"
      >
        <div
          class="header-left"
        >
          <iconify-icon
            :class="['icon-left', isSelect ? 'primary--text' : 'neutral-600--text']"
            :icon="isSelect ? isExistCategories ? 'feather-minus' : 'feather-plus' : 'feather-plus'"
            width="21"
          />
          <a
            class="body-m-medium"
            :href="`#${category.name}`"
            :class="isSelect ? 'neutral-900--text' : 'neutral-600--text'"
          >
            <p>
              {{ category.name }}
            </p>
          </a>
        </div>
        <iconify-icon
          v-if="isExistCategories"
          :class="['icon-right', isSelect ? 'primary--text' : 'neutral-600--text']"
          :icon="isSelect ? 'jam-square-minus' : 'mdi-square-rounded-outline'"
          width="21"
        />
        <div
          v-else-if="isSelect"
          class="icon-square-checkmark"
        >
          <iconify-icon
            :class="['icon-right', 'neutral-100--text']"
            icon="eva-checkmark-outline"
            width="15"
          />
        </div>
        <iconify-icon
          v-else
          :class="['icon-right', isSelect ? 'primary--text' : 'neutral-600--text']"
          icon="mdi-square-rounded-outline"
          width="21"
        />
      </div>
      <div
        v-if="isSelect && isExistCategories"
        class="list"
      >
        <category-list
          v-for="(item, i) in category.categories"
          :key="i"
          :category="item"
          :index="i"
          :category-selected="categorySelected"
          @addCategory="addCategory"
          @removeCategory="removeCategory"
        />
      </div>
    </li>
  </ul>
</template>

<script>
  import CategoryList from '@/components/extended/category-side-panel/category-list'

  export default {
    name: 'CategoryList',
    components: {
      CategoryList,
    },
    props: {
      category: {
        type: Object,
        default: () => {
          return {}
        },
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
      index: {
        type: [Number, String],
        default: '',
      },
      categorySelected: {
        type: Array,
        default () {
          return []
        },
        required: false,
      },
    },
    data () {
      return {
        isSelect: false,
        innerCategory: this.category,
        innerCategorySelected: this.categorySelected,
      }
    },
    computed: {
      isExistCategories () {
        return Object.keys(this.category).includes('categories') && this.category.categories.length
      },
    },
    watch: {
      isSelect (v) {
        if (v) {
          this.select()
        } else {
          this.remove()
        }
      },
      category: {
        deep: true,
        handler (v) {
          if (Object.keys(v).includes('select')) {
            if (v.select && !this.isSelect) {
              this.isSelect = true
            } else if (!v.select && this.isSelect) {
              this.isSelect = false
            }
          } else {
            this.isSelect = false
          }
        },
      },
    },
    mounted () {
    },
    methods: {
      select () {
        this.$emit('addCategory', this.categoryClean(this.category))
      },
      remove () {
        this.$emit('removeCategory', this.categoryClean(this.category), this.index)
      },
      addCategory (category) {
        const selectedIndex = this.selectedCategoryfindIndexByCategory(category)
        if (selectedIndex <= -1) {
          this.innerCategorySelected.push(this.categoryClean(category))
        }
      },
      selectedCategoryfindIndexByCategory (category) {
        return this.innerCategorySelected.findIndex((categorySelect) => {
          return this.isCategoryEqual(categorySelect, category)
        })
      },
      removeCategory (category, index) {
        const selectedIndex = this.selectedCategoryfindIndexByCategory(category)
        this.removeChildCategoriesOfSelected(this.category.categories[index].categories)
        this.innerCategorySelected.splice(selectedIndex, 1)
      },
      removeChildCategoriesOfSelected (categories) {
        for (let i = 0; i < categories.length; i++) {
          this.innerCategorySelected.forEach((categorySelected, index) => {
            if (this.isCategoryEqual(categories[i], categorySelected)) {
              this.innerCategorySelected.splice(index, 1)
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
      categoryClean (category) {
        const newCategory = JSON.parse(JSON.stringify(category))
        if (Object.keys(category).includes('categories')) delete newCategory.categories
        if (Object.keys(category).includes('select')) delete newCategory.select
        return newCategory
      },
    },
  }
</script>
<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography.sass";

.category__list {
  list-style: none;
  padding-left: 13px;
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
  .category__item {
    .item__header {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      .header-left {
        display: flex;
        .icon-left {
          color: $neutral-500;
          margin-right: 8px;
        }
        a {
          text-decoration: none;
        }
      }
      .icon-right {
        color: $neutral-500;
        float: right;
      }
      .icon-square-checkmark {
        display: block;
        background: #4776E6;
        border-radius: 4px;
        width: 15.75px;
        height: 15.75px;
        margin-right: 2.5px;
        margin-top: 2.5px;
        position: relative;
        .icon-right {
          float: none;
          position: absolute;
          top: 0.8px;
          left: 0.75px;
        }
      }
    }
    &.active {
      .item__header {
        margin-bottom: 8px;
      }
    }
  }
  p {
    margin-bottom: 0;
  }
}

</style>
