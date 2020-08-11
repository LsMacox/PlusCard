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
        ></v-text-field>
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
          ></v-text-field>
        </div>
        <div class="mt-1">
          <v-text-field
            placeholder="append-icon"
            append-icon="mdi-calendar-blank-outline"
            outlined
          ></v-text-field>
        </div>
        <div class="mt-1 mb-1">
          <v-text-field
            placeholder="persistent-hint"
            hint="Подсказка"
            persistent-hint
            append-icon="mdi-calendar-blank-outline"
            outlined
          ></v-text-field>
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
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'DashboardDashboard',

    data () {
      return {
        dailySalesChart: {
          data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
              [12, 17, 7, 17, 23, 18, 38],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        dataCompletedTasksChart: {
          data: {
            labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
            series: [
              [230, 750, 450, 300, 280, 240, 200, 190],
            ],
          },
          options: {
            lineSmooth: this.$chartist.Interpolation.cardinal({
              tension: 0,
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            },
          },
        },
        emailsSubscriptionChart: {
          data: {
            labels: ['Ja', 'Fe', 'Ma', 'Ap', 'Mai', 'Ju', 'Jul', 'Au', 'Se', 'Oc', 'No', 'De'],
            series: [
              [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],

            ],
          },
          options: {
            axisX: {
              showGrid: false,
            },
            low: 0,
            high: 1000,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0,
            },
          },
          responsiveOptions: [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0]
                },
              },
            }],
          ],
        },
        headers: [
          {
            sortable: false,
            text: 'ID',
            value: 'id',
          },
          {
            sortable: false,
            text: 'Name',
            value: 'name',
          },
          {
            sortable: false,
            text: 'Salary',
            value: 'salary',
            align: 'right',
          },
          {
            sortable: false,
            text: 'Country',
            value: 'country',
            align: 'right',
          },
          {
            sortable: false,
            text: 'City',
            value: 'city',
            align: 'right',
          },
        ],
        items: [
          {
            id: 1,
            name: 'Dakota Rice',
            country: 'Niger',
            city: 'Oud-Tunrhout',
            salary: '$35,738',
          },
          {
            id: 2,
            name: 'Minerva Hooper',
            country: 'Curaçao',
            city: 'Sinaai-Waas',
            salary: '$23,738',
          },
          {
            id: 3,
            name: 'Sage Rodriguez',
            country: 'Netherlands',
            city: 'Overland Park',
            salary: '$56,142',
          },
          {
            id: 4,
            name: 'Philip Chanley',
            country: 'Korea, South',
            city: 'Gloucester',
            salary: '$38,735',
          },
          {
            id: 5,
            name: 'Doris Greene',
            country: 'Malawi',
            city: 'Feldkirchen in Kārnten',
            salary: '$63,542',
          },
        ],
        tabs: 0,
        tasks: {
          0: [
            {
              text: 'Sign contract for "What are conference organizers afraid of?"',
              value: true,
            },
            {
              text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
              value: false,
            },
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: false,
            },
            {
              text: 'Create 4 Invisible User Experiences you Never Knew About',
              value: true,
            },
          ],
          1: [
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: true,
            },
            {
              text: 'Sign contract for "What are conference organizers afraid of?"',
              value: false,
            },
          ],
          2: [
            {
              text: 'Lines From Great Russian Literature? Or E-mails From My Boss?',
              value: false,
            },
            {
              text: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
              value: true,
            },
            {
              text: 'Sign contract for "What are conference organizers afraid of?"',
              value: true,
            },
          ],
        },
        list: {
          0: false,
          1: false,
          2: false,
        },
      }
    },

    methods: {
      complete (index) {
        this.list[index] = !this.list[index]
      },
    },
  }
</script>
