<template>
  <v-container
    id="dashboard"
    fluid
    tag="section"
  >
    <v-row>
      <v-col
        cols="12"
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
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            :ripple="false"
            color="primary"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Leading icon
          </v-btn>
        </div>

        <div class="mt-1">
          <v-btn
            :ripple="false"
            color="primary"
          >
            Trailing icon
            <v-icon right>
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </div>

        <div class="mt-1">
          <v-btn
            :ripple="false"
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
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            :ripple="false"
            color="secondary"
          >
            <v-icon left>
              mdi-plus-circle-outline
            </v-icon>
            Secondary btn
          </v-btn>
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            color="secondary"
            :small="true"
          >
            small btn
          </v-btn>
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            color="secondary"
            :text="true"
          >
            <v-icon>mdi-arrow-left</v-icon>
            text btn
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="12"
        lg="3"
      >
        <div class="mt-1">
          <v-btn
            :ripple="false"
            class="mx-2"
            fab
            dark
            small
            color="primary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          small-primary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            class="mx-2"
            fab
            dark
            x-small
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          extra-small-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            class="mx-2"
            fab
            dark
            small
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          small-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            class="mx-2"
            fab
            dark
            color="secondary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          default-secondary-round-btn
        </div>
        <div class="mt-1">
          <v-btn
            :ripple="false"
            class="mx-2"
            fab
            dark
            large
            color="neutral"
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
            offset-x="18"
          >
            <v-btn
              :ripple="false"
              class="mx-2"
              fab
              dark
              x-small
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
        lg="3"
      >
        <v-text-field
          placeholder="outline-text-field"
          outlined
        />
      </v-col>
      <v-col
        cols="12"
        lg="3"
      >
        <div>
          <v-text-field
            placeholder="prepend-icon"
            prepend-inner-icon="mdi-calendar-blank-outline"
            outlined
          />
        </div>
        <div class="mt-1">
          <v-text-field
            placeholder="append-icon"
            append-icon="mdi-calendar-blank-outline"
            outlined
          />
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
        lg="3"
      >
        <v-text-field
          :ripple="false"
          outlined
          class="customInput"
        >
          <template slot="prepend">
            <v-btn-toggle
              v-model="toggle_exclusive"
            >
              <v-btn
                :ripple="false"
                color="btnInput"
                text
              >
                <v-icon>mdi-format-align-left</v-icon>
              </v-btn>
              <div />

            </v-btn-toggle>
          </template>

        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {}
    },

    methods: {
    },
  }
</script>
