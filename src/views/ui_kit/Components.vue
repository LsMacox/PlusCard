<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-select
      v-model="selectedFruits"
      :items="fruits"
      placeholder="multiple select"
      outlined
      multiple
      :ripple="false"
    >
      <template v-slot:item="data">
        <div style="display: flex; align-items: center;">
          <div
            v-if="data.attrs.inputValue"
            :key="data.item.text + 'active'"
            class="active"
          >
            <span
              class="iconify"
              data-icon="eva:checkmark-square-2-fill"
              data-inline="false"
            />
          </div>
          <div
            v-else
            :key="data.item.text + 'inactive'"
            class="inactive"
          >
            <span
              class="iconify"
              data-icon="eva:square-outline"
              data-inline="false"
            />
          </div>
          <span>{{ data.item.text + ' ' + data.attrs.inputValue }}</span>
        </div>
      </template>
    </v-select>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <div style="padding:10px;">
          <div class="title-xl-bold">
            TitleXL 34-40/Bold
          </div>
          <div class="title-xl-regular">
            TitleXL 34-40/Regular
          </div>
          <div class="title-l-bold">
            Title L 28-34/Bold
          </div>
          <div class="title-l-regular">
            Title L 28-34/Regular
          </div>
          <div class="title-m-bold">
            Title M 22-28/Bold
          </div>
          <div class="title-m-regular">
            Title M 22-28/Regular
          </div>
          <div class="title-s-bold">
            Title S 20-24/Bold
          </div>
          <div class="title-s-regular">
            Title S 20-24/Regular
          </div>
          <div class="body-l-semibold">
            Body L 17-22/SemiBold
          </div>
          <div class="body-l-regular">
            Body L 17-22/Regular
          </div>
          <div class="body-m-semibold">
            Body M 15-20/Semibold
          </div>
          <div class="body-m-medium">
            Body M 15-20/Medium
          </div>
          <div class="body-m-regular">
            Body M 15-20/Regular
          </div>
          <div class="body-s-semibold">
            Body S 13-18/SemiBold
          </div>
          <div class="body-s-regular">
            Body S 13-18/Regular
          </div>
          <div class="body-xs-semibold">
            Body XS 11-14/Semibold
          </div>
          <div class="body-xs-medium">
            Body XS 11-14/Medium
          </div>
          <div class="body-xs-regular">
            Body XS 11-14/Regular
          </div>
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            color="primary"
          >
           <v-icon>$iconify_plus-circle-outlined</v-icon>   
             <iconify-icon icon="plus-circle-outlined" height="24" />        
            <span
              class="iconify"
              data-icon="ant-design:plus-circle-outlined"
              data-inline="false"
            />
            Leading icon
          </v-btn>
        </div>

        <div class="mt-1">
          <v-btn
            color="primary"
            small
          >
            Trailing icon
            <v-icon right>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </div>

        <div class="mt-1">
          <v-btn
            color="primary"
            :disabled="true"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Leading icon
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            color="secondary"
          >
            <span
              class="iconify"
              data-icon="ant-design:plus-circle-outlined"
              data-inline="false"
            />
            Secondary btn
          </v-btn>
        </div>
        <div class="mt-1">
          <v-btn
            color="secondary"
            :small="true"
          >
            small btn
          </v-btn>
        </div>
        <div class="mt-1">
          <v-btn
            color="secondary"
            :text="true"
            :ripple="false"
          >
            <v-icon>mdi-arrow-left</v-icon>
            text btn
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            fab
            small
            color="primary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          small-primary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            fab
            x-small
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          extra-small-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            fab
            small
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          small-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            fab
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          default-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            fab
            large
            color="neutral"
            :ripple="false"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          large-neutral-round-btn
        </div>
        <div class="mt-1">
          <v-badge
            dot
            color="error"
            overlap
            avatar
            offset-x="25"
          >
            <v-btn
              fab
              small
              color="secondary"
            >
              12
            </v-btn>
          </v-badge>
          small-secondary-button-with-notify
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-text-field
          placeholder="outline-text-field"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <div>
          <v-text-field
            placeholder="prepend-icon"
            outlined
          >
            <template slot="prepend-inner">
              <span
                class="iconify"
                data-icon="ion:mail-outline"
                data-inline="false"
              />
            </template>
          </v-text-field>
        </div>
        <div class="mt-1">
          <v-text-field
            placeholder="append-icon"
            outlined
          >
            <template slot="append">
              <span
                class="iconify"
                data-icon="carbon:calendar"
                data-inline="false"
              />
            </template>
          </v-text-field>
        </div>
        <div class="mt-1 mb-1">
          <v-text-field
            placeholder="persistent-hint"
            hint="Подсказка"
            persistent-hint
            append-icon="mdi-calendar-blank-outline"
            outlined
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-text-field
          placeholder="password"
          append-icon="mdi-calendar-blank-outline"
          outlined
          type="password"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-text-field
          outlined
          class="customInput"
        >
          <template slot="prepend">
            <v-menu
              top
              :offset-y="offset"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="btnInput"
                  text
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-img
                    :src="currentCountry.icon"
                    width="24px"
                    contain
                  />
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @click="changeCountry(item)"
                >
                  <v-list-item-icon>
                    <v-img
                      :src="item.icon"
                      width="24px"
                    />
                  </v-list-item-icon>
                  <v-list-item-title style="cursor:pointer;">
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="6"
        lg="3"
      >
        <v-select
          v-model="selectedFruits"
          :items="fruits"
          placeholder="multiple select"
          outlined
          multiple
        >
          <template v-slot:item="data">
            <div style="display: flex; align-items: center;">
              <div
                v-if="data.attrs.inputValue"
                :key="data.item.text + 'active'"
                class="active"
              >
                <span
                  class="iconify"
                  data-icon="eva:checkmark-square-2-fill"
                  data-inline="false"
                />
              </div>
              <div
                v-else
                :key="data.item.text + 'inactive'"
                class="inactive"
              >
                <span
                  class="iconify"
                  data-icon="eva:square-outline"
                  data-inline="false"
                />
              </div>
              <span>{{ data.item.text + ' ' + data.attrs.inputValue }}</span>
            </div>
          </template>
        </v-select>
        <v-select
          v-model="selectedFruits"
          :items="fruits"
          placeholder="multiple select"
          outlined
          multiple
        >        
        </v-select>
         <v-autocomplete  
            v-model="selectedFruits"           
              :items="fruits"              
              placeholder="Выберите категории"              
              outlined
              multiple
              chips
              deletable-chips            
            />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        SMALL
           <v-autocomplete  
            v-model="selectedFruits"           
              :items="fruits"              
              placeholder="Выберите категории"              
              outlined
              multiple
              chips
              deletable-chips    
              dense        
            />
      </v-col>
    </v-row>
    
    <v-row><v-col>
       <v-icon>$iconify_plus-circle</v-icon>
       <iconify-icon icon="plus-circle" height="14" />
      </v-col></v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        svgIcon: require('@/assets/svg/building.svg'),
        items: [
          {
            text: 'Russia',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAAD1BMVEX///8AOabVKx6qveGOMEuAx7gLAAAAnElEQVR4nO3PQQGAMADEsBvgX/Nk8GjiIBsAAAAAAAAAAAAAAAAA/3uzdrLUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1Iv2Ze3JUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvuvJNp/lJwZZQAAAAAElFTkSuQmCC  ',
          },
          {
            text: 'Finland',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR8AAACvCAMAAADzNCq+AAAAJ1BMVEX///8ANYAAIXjEydkAHXcAJ3vW2uSYor4ALX3Z3eakrcV1g6rJztwyDCYaAAABk0lEQVR4nO3bxw0DMRAEwZO3+ccrRdAAgX0Ip6oEluz/bNus6/mw4nIbvv/r9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2f9thbn9Os52Wpz/31Hn7AsO04ay3PN9Dw/Wnb4n/+jT5Nn6ZP06fp0/Rp+jR9mj5Nn6ZP06fp0/Rp+jR9mj5Nn6ZP06fp0/Rp+jR9mj5Nn6ZP06fp0/Rp+jR9mj5Nn6ZP06fp0/Rp+jR9mj5Nn6ZP06fZ7zT7rzY9t9vdfnCY/WnTp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6NH2aPk2fpk/Tp+nT9Gn6tL31+QBWD13o5n7XDgAAAABJRU5ErkJggg==',
          },
        ],
        offset: true,
        currentCountry: {
          text: 'Russia',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAAD1BMVEX///8AOabVKx6qveGOMEuAx7gLAAAAnElEQVR4nO3PQQGAMADEsBvgX/Nk8GjiIBsAAAAAAAAAAAAAAAAA/3uzdrLUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1Iv2Ze3JUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvUi9SL1IvuvJNp/lJwZZQAAAAAElFTkSuQmCC  ',
        },
        fruits: [
          { text: this.$t('dashboard'), checked: 'false' },
          { text: 'Apricots', checked: 'false' },
          { text: 'Avocado', checked: 'false' },
          { text: 'Bananas', checked: 'false' },
          { text: 'Blueberries', checked: 'false' },
        ],
        selectedFruits: [],
      }
    },
    computed: {
      likesAllFruit () {
        return this.selectedFruits.length === this.fruits.length
      },
      likesSomeFruit () {
        return this.selectedFruits.length > 0 && !this.likesAllFruit
      },
      icon () {
        if (this.likesAllFruit) return 'mdi-close-box'
        if (this.likesSomeFruit) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },
    methods: {
      getIcon (bool) {
        if (bool) return '<span class="iconify" data-icon="eva:checkmark-square-2-fill" data-inline="false"></span>'
        else return '<span class="iconify" data-icon="eva:square-outline" data-inline="false"></span>'
      },
      toggle () {
        this.$nextTick(() => {
          if (this.likesAllFruit) {
            this.selectedFruits = []
          } else {
            this.selectedFruits = this.fruits.slice()
          }
        })
      },
      changeCountry (item) {
        this.currentCountry = item
      },
    },
  }
</script>
