<template>
  <v-container id="empty-company">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="6"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-img
            src="@/assets/svg/empty_company.svg"
            max-width="215px"
            max-height="175px"
          />
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <div
            style="margin-top:2.4rem"
            class="title-s-bold"
          >
            Добавьте свою компанию в Plus!
          </div>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <div
            style="margin-top:.9rem; text-align:center; color: #70707D"
            class="body-m-regular"
          >
            Создавайте и настраивайте программы и сертификаты,<br> отслеживайте показатели продаж и многое другое.
          </div>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <div
            style="margin-top:2.4rem; text-align:center; color: #70707D"
            class="body-m-regular"
          >
            <v-btn
              color="primary"
              style="width: 223px"
              @click="$router.push('/master')"
            >
              <v-icon left>
                mdi-plus-circle-outline
              </v-icon>
              Добавить компанию
            </v-btn>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {

  }
</script>

<style lang="sass" scoped>
  #empty-company
    height: 100%
    display: flex
</style>
