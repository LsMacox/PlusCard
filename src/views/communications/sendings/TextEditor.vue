<template>
  <v-container class="">
    
    <v-layout row>
      <v-flex class="px-3">
        <v-card>
          <v-toolbar color="light-blue" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>

            <v-toolbar-title>Шаблоны</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="createNewMessTemplate">
              <v-icon>add</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list v-if="AdMessTempls && AdMessTempls.length>0">
            <v-list-tile
              v-for="templ in AdMessTempls"
              active-class="highlighted"
              :key="templ.id"
              :class="templ.id === curMessTemplate_id? 'selected-item' : ''"
              @click="selectTemplate(templ)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ templ.name }}</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple @click.stop="deleteTemplate(templ)">
                  <v-icon color="grey lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-text>
            <v-text-field
              v-model="cur_name"
              :rules="nameRules"
              :counter="50"
              label="Название"
              required
            ></v-text-field>
            <v-input v-model="cur_name"></v-input>
            <Vueditor ref="editor" class="text-editor"></Vueditor>
            <v-alert :value="!htmlValidation.valid" type="error">{{htmlValidation.error}}</v-alert>
            <v-btn
              v-if="curMessTemplate"
              @click="clickUpdate"
              :loading="loading"
              :disabled="loading"
              color="info"
            >Сохранить</v-btn>

            <v-btn
              v-else
              :loading="loading"
              :disabled="loading"
              color="info"
              @click="clickCreate"
            >Создать</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vueditor from "vueditor";

import "vueditor/dist/style/vueditor.min.css";
 
// your config here
let config = {
  // toolbar: [
  //   'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider',
  //   'bold', 'italic', 'underline', 'strikeThrough', 'links', 'divider', 'subscript', 'superscript',
  //   'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|', 'indent', 'outdent',
  //   'insertOrderedList', 'insertUnorderedList', '|', 'picture', 'tables', '|', 'switchView'
  // ],
  fontName: [
    { val: "arial black" },
    { val: "times new roman" },
    { val: "Courier New" }
  ],
  fontSize: [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px"
  ],
  uploadUrl: "",
  classList: []
};

Vue.use(Vueditor, config);

export default {
  components: {},
  props:['currentProgramId'],
  data() {
    return {
      cur_name: "",
      loading: false,
      curMessTemplate: null,
      uploadedFiles: [],
      AdMessTempls: [],      
      nameRules: [
        v => !!v || "Название обязательно",
        v => v.length <= 50 || "Название должно быть не более 50 символов"
      ],
      htmlRules: [v => !!v || "Введите текст"],
      htmlValidation: {
        valid: true,
        error: ""
      }
    };
  },
  computed: {
    loadingApp() {
      return this.$store.getters["template/shared/loadingApp"];
    },    
    
    HtmlContent: {
      get: function() {
        return this.$refs.editor.getContent();
      },
      set: function(val) {
        return this.$refs.editor.setContent(val);
      }
    },
    
    curMessTemplate_id() {
      if (this.curMessTemplate) {
        return this.curMessTemplate.id;
      } else {
        return null;
      }
    }
  },
  watch: {
    
    currentProgramId(val) {
      //this.currentProgramId = val.id;
      this.getProgrammTempl();
    },
    curMessTemplate(val) {
      if (val) {
        this.cur_name = val.name;
        this.HtmlContent = val.template;
      } else {
        this.cur_name = "";
        this.HtmlContent = "";
      }
    }
  },
  methods: {
    setErrorMessage (error) {
       this.$notify({message:  error, type: 'error'}); 
          
        },
    clearImages() {
      let html = this.HtmlContent;
      for (let index = 0; index < this.uploadedFiles.length; index++) {
        let fileName = this.uploadedFiles[index];
        if (!html.includes(fileName)) {
          ////console.log("remove" + fileName);
        }
      }
    },
    uploadImage(obj, callback) {
      const file = obj.files[0];
      if (file.size > 1048576) {
        alert("File size is larger than 1MB!");
      } else {
        let formData = new FormData();
        formData.append("image", file);
        axios
          .post(`/api/ad/message/template/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(response => {
            ////console.log("file upload url:" + response.data.url);
            this.uploadedFiles.push(response.data.path);
            callback(response.data.url);
          })
          .catch(error => {
          if (error.response) {
            ////console.log(JSON.stringify(error.response.data));
          }
        })
      }
    },
    validateForm() {
      this.htmlValidation.valid = true;
      this.htmlValidation.error = "";
      let html = this.HtmlContent;
      for (let i = 0; i < this.htmlRules.length; i++) {
        let res = this.htmlRules[i](html);
        if (res !== true) {
          this.htmlValidation.valid = false;
          this.htmlValidation.error = res;
          return false;
        }
      }

      for (let i = 0; i < this.nameRules.length; i++) {
        let res = this.nameRules[i](this.cur_name);
        if (res !== true) {
          return false;
        }
      }
      return true;
    },
    createNewMessTemplate() {
      this.curMessTemplate = null;
    },
    selectTemplate(templ) {
      this.curMessTemplate = templ;
    },
    getMessTempl() {},
    deleteTemplate(templ) {
      axios.delete(`/api/ad/message/template/${templ.id}`).then(response => {
        if (templ.id == this.curMessTemplate.id) this.curMessTemplate = null;
        let index = this.AdMessTempls.findIndex(x => x.id === templ.id);
        Vue.delete(this.AdMessTempls, index);
      });
    },
    getProgrammTempl() {
      this.loading = true;
      this.curMessTemplate = null;
      axios
        .get(`api/programs/${this.currentProgramId}/ad/message/template`)
        .then(response => {
          this.AdMessTempls = response.data;
          if (this.AdMessTempls.length > 0) {
            this.curMessTemplate = this.AdMessTempls[0];
          }
        })
        .catch(error => {
          if (error.response) {
            ////console.log(JSON.stringify(error.response.data));
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clickCreate() {
      if (!this.validateForm()) return;
      this.loading = true;
      const newMess = {
        name: this.cur_name,
        template: this.HtmlContent,
        program_id: this.currentProgramId
      };
      axios
        .post("/api/ad/message/template", newMess)
        .then(response => {
          this.curMessTemplate = response.data;
          this.AdMessTempls.push(this.curMessTemplate);
        })
        .catch(error => {
          if (error.response) {
            ////console.log(JSON.stringify(error.response.data));
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clickUpdate() {
      if (!this.validateForm()) return;
      this.loading = true;
      //`/api/ad/message/template/${this.curMessTemplate.id}`
      axios
        .put(`/api/ad/message/template`, {
          id: this.curMessTemplate.id,
          name: this.cur_name,
          template: this.HtmlContent
        })
        .then(response => {
          this.curMessTemplate = response.data;
          let index = this.AdMessTempls.findIndex(
            x => x.id === this.curMessTemplate.id
          );
          this.AdMessTempls[index] = this.curMessTemplate;

          //this.getProgrammTempl();
        })
        .catch(error => {
          if (error.response) {
            ////console.log(JSON.stringify(error.response.data));
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    
  },
  created() {
    this.getProgrammTempl();
  },
  mounted() {
    this.$refs.editor.upload = this.uploadImage;    
  },
  beforeDestroy() {   
  }
};
</script>

<style scoped>
.selected-item {
  background-color: lightblue;
}
.text-editor {
  height: 500px;
}
</style>
